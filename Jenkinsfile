pipeline {
    agent any

    environment {
        IMAGE_NAME = 'imly-ui-qa'
        DOCKER_IMAGE = 'b2yinfy/imly-ui-qa'
        DOCKER_TAG = 'latest'
        VPS_HOST = '156.67.111.32'
        VPS_USER = 'yuvak'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }

        stage('Login to DockerHub') {
            steps {
                script {
                    // Using withCredentials to access DockerHub credentials securely
                    withCredentials([usernamePassword(credentialsId: 'dockerhub-jenkins-token', usernameVariable: 'DOCKERHUB_CREDENTIALS_USR', passwordVariable: 'DOCKERHUB_CREDENTIALS_PSW')]) {
                        // Login to DockerHub
                        sh """
                            echo ${DOCKERHUB_CREDENTIALS_PSW} | docker login -u ${DOCKERHUB_CREDENTIALS_USR} --password-stdin
                        """
                    }
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                script {
                    // Push the Docker image to DockerHub
                    sh "docker push ${DOCKER_IMAGE}:${DOCKER_TAG}"
                }
            }
        }

        stage('Deploy to VPS') {
            steps {
                script {
                    // Deploy using SSH
                    withCredentials([sshUserPrivateKey(credentialsId: 'ssh-jenkins-token', keyFileVariable: 'SSH_KEY')]) {
                        sh """
                            ssh -o StrictHostKeyChecking=no -i ${SSH_KEY} ${VPS_USER}@${VPS_HOST} '
                                docker pull ${DOCKER_IMAGE}:${DOCKER_TAG}
                                docker ps -q --filter "name=${IMAGE_NAME}" | grep -q . && docker stop ${IMAGE_NAME} || echo "Container ${IMAGE_NAME} not running"
                                docker ps -aq --filter "name=${IMAGE_NAME}" | grep -q . && docker rm ${IMAGE_NAME} || echo "Container ${IMAGE_NAME} does not exist"
                                docker run -d \\
                                    --name ${IMAGE_NAME} \\
                                    -p 5020:5020 \\
                                    ${DOCKER_IMAGE}:${DOCKER_TAG}
                            '
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            // Clean up Docker login
            sh 'docker logout'
        }
    }
}
