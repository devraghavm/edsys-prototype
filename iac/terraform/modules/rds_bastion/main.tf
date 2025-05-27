resource "aws_instance" "this" {
  ami                         = var.ami_id
  instance_type               = "t3.micro"
  count                       = 1
  vpc_security_group_ids      = [var.security_group_ids.lambda_sg, var.security_group_ids.ec2_sg]
  subnet_id                   = var.app_subnet_ids[0]
  associate_public_ip_address = false
  iam_instance_profile        = aws_iam_instance_profile.ec2_ssm_profile.name
  user_data                   = var.ec2_user_data
}

resource "aws_iam_role" "ec2_ssm" {
  name = "${var.rds_prefix}-ec2-ssm-role-${var.random_string_id}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "ec2.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ec2_ssm_attach" {
  role       = aws_iam_role.ec2_ssm.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_ssm_profile" {
  name = "${var.rds_prefix}-ec2-ssm-profile-${var.random_string_id}"
  role = aws_iam_role.ec2_ssm.name
}
