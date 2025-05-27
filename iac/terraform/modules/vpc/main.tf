data "http" "my_ip" {
  url = "https://checkip.amazonaws.com/"
}

locals {
  my_laptop_ip = "${chomp(data.http.my_ip.response_body)}/32"
}

resource "aws_vpc" "my_vpc" {
  cidr_block           = var.vpc_cidr
  instance_tenancy     = "default"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "${var.app_name}-${var.environment}-vpc"
  }
}

resource "aws_subnet" "public" {
  count                   = length(var.public_cidr)
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = element(var.public_cidr, count.index)
  availability_zone       = element(var.azs, count.index)
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.app_name}-${var.environment}-public-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "app" {
  count                   = length(var.app_cidr)
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = element(var.app_cidr, count.index)
  availability_zone       = element(var.azs, count.index)
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.app_name}-${var.environment}-app-subnet-${count.index + 1}"
  }
}

resource "aws_subnet" "db" {
  count                   = length(var.db_cidr)
  vpc_id                  = aws_vpc.my_vpc.id
  cidr_block              = element(var.db_cidr, count.index)
  availability_zone       = element(var.db_azs, count.index)
  map_public_ip_on_launch = true
  tags = {
    Name = "${var.app_name}-${var.environment}-db-subnet-${count.index + 1}"
  }
}

resource "aws_internet_gateway" "my_vpc_igw" {
  vpc_id = aws_vpc.my_vpc.id

}

resource "aws_eip" "nat_eip" {}

resource "aws_nat_gateway" "edsys_nat_gwy" {
  subnet_id     = aws_subnet.public[0].id
  allocation_id = aws_eip.nat_eip.id
  depends_on    = [aws_internet_gateway.my_vpc_igw, aws_eip.nat_eip]
}

resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.my_vpc_igw.id
  }
}

resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.my_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.edsys_nat_gwy.id
  }
}

resource "aws_route_table_association" "public" {
  count          = length(var.public_cidr)
  subnet_id      = element(aws_subnet.public.*.id, count.index)
  route_table_id = aws_route_table.public_rt.id
}

resource "aws_route_table_association" "private" {
  count          = length(var.public_cidr)
  subnet_id      = element(aws_subnet.app.*.id, count.index)
  route_table_id = aws_route_table.private_rt.id
}

resource "aws_security_group" "lambda_sg" {
  name        = "lambda-vpc-access"
  description = "associated with lambda function"
  vpc_id      = aws_vpc.my_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ec2" {
  name        = "internet_out"
  description = "Allow outbound to internet"
  vpc_id      = aws_vpc.my_vpc.id

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

resource "aws_security_group" "db_mysql" {
  name        = "allow_mysql"
  description = "Allow mysql inbound traffic"
  vpc_id      = aws_vpc.my_vpc.id

  ingress {
    description = "mysql from private subnets"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = var.app_cidr
  }

  ingress {
    description     = "mysql from lambda sg"
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.lambda_sg.id]
  }

  ingress {
    description = "mysql from my laptop"
    from_port   = 3306
    to_port     = 3306
    protocol    = "tcp"
    cidr_blocks = [local.my_laptop_ip]
  }


  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

resource "aws_vpc_endpoint" "ssm" {
  vpc_id              = aws_vpc.my_vpc.id
  service_name        = "com.amazonaws.${var.aws_region}.ssm"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.app[*].id
  security_group_ids  = [aws_security_group.ec2.id]
  private_dns_enabled = true
  tags                = { Name = "${var.app_name}-${var.environment}-ssm-endpoint" }
}

resource "aws_vpc_endpoint" "ec2messages" {
  vpc_id              = aws_vpc.my_vpc.id
  service_name        = "com.amazonaws.${var.aws_region}.ec2messages"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.app[*].id
  security_group_ids  = [aws_security_group.ec2.id]
  private_dns_enabled = true
  tags                = { Name = "${var.app_name}-${var.environment}-ec2messages-endpoint" }
}

resource "aws_vpc_endpoint" "ssmmessages" {
  vpc_id              = aws_vpc.my_vpc.id
  service_name        = "com.amazonaws.${var.aws_region}.ssmmessages"
  vpc_endpoint_type   = "Interface"
  subnet_ids          = aws_subnet.app[*].id
  security_group_ids  = [aws_security_group.ec2.id]
  private_dns_enabled = true
  tags                = { Name = "${var.app_name}-${var.environment}-ssmmessages-endpoint" }
}

resource "aws_db_subnet_group" "default" {
  name       = "db main"
  subnet_ids = aws_subnet.db[*].id

  tags = {
    Name = "My DB subnet group"
  }
}
