# Output value definitions

output "vpc_id" {
  description = "the vpc id"
  value = aws_vpc.edsys_vpc.id
}

output "lambda_sg" {
  description = "security group to be assigned to lambda function"
  value = aws_security_group.lambda_sg.id
}

output "lambda_subnet_1" {
  description = "private subnet id for lambda function"
  value = aws_subnet.app[0].id
}

output "lambda_subnet_2" {
  description = "private subnet id for lambda function"
  value = aws_subnet.app[1].id
}

output "db_subnet_ids" {
  value = aws_subnet.db[*].id
}

output "app_subnet_ids" {
  value = aws_subnet.app[*].id
}

output "security_group_ids" {
  value = {
    lambda_sg = aws_security_group.lambda_sg.id
    ec2_sg    = aws_security_group.ec2.id
    db_mysql  = aws_security_group.db_mysql.id
  }
}