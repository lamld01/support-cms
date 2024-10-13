pipeline {
    agent any
    environment {
        BRANCH_NAME = "${GIT_BRANCH.split("/")[1]}"
        DOCKER_HUB_URL="docker.io"
        REPOSITORY="lamld2510"
        DOCKER_HUB_TOKEN=credentials("lamld2510_docker_hub_token")
        NAME="dev-tools-cms"
    }
    stages {
        stage('Build') {
            steps {
                script {
                  sh "sudo docker build -t ${REPOSITORY}/${NAME}:${BUILD_NUMBER} ."
                }
            }
        }
        stage('Push') {
            steps {
                script {
                  sh "sudo docker login --username=${REPOSITORY} --password=${DOCKER_HUB_TOKEN} ${DOCKER_HUB_URL}"
                  sh "sudo docker push ${REPOSITORY}/${NAME}:${BUILD_NUMBER}"
                  sh "sudo docker tag ${REPOSITORY}/${NAME}:${BUILD_NUMBER} ${REPOSITORY}/${NAME}:latest"
                  sh "sudo docker push ${REPOSITORY}/${NAME}:latest"
                }
            }
        }
    }
}
