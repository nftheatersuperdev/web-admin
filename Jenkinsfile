@Library('shared-jenkins-library@master') _

pipeline {
    agent { label "master" }
    tools { nodejs 'NodeJS' }

    parameters {
      string(name: 'RELEASE_VERSION', defaultValue: '0.0.1', description: 'Release Version')
    }

    stages {
        stage ('Install Package') {
            steps {
                sh 'npm install'
            }
        }
        stage ('Copy Environment') {
             steps{
                sh "cp /data/web-admin/${ENVIRONMENT}/.env /var/lib/jenkins/workspace/web-admin-${INTERNAL_ENVIRONMENT}/.env"
             }
        }
        stage ('Build Static File') {
            steps {
                sh 'npm run build'
            }
        }
        stage ('Zip') {
             steps{
                sh "cd build && zip -r admin-web-${ENVIRONMENT}-${RELEASE_VERSION}-${currentBuild.number}.zip ./* && cd -"
             }
        }
        stage ('Upload to S3') {
             steps{
                sh "aws s3 cp ./build/admin-web-${ENVIRONMENT}-${RELEASE_VERSION}-${currentBuild.number}.zip s3://web-admin-${INTERNAL_ENVIRONMENT}/admin-web-${ENVIRONMENT}-${RELEASE_VERSION}-${currentBuild.number}.zip --acl public-read"
             }
        }
        stage ('Deploy') {
             steps{
                sh "aws amplify start-deployment --app-id ${AMPLIFY_APP_ID} --branch-name ${ENVIRONMENT} --source-url=s3://web-admin-${INTERNAL_ENVIRONMENT}/admin-web-${ENVIRONMENT}-${RELEASE_VERSION}-${currentBuild.number}.zip"
             }
        }
    }

    post {
        always {
            script {
                sendNotifications(currentBuild.result)
            }
        }
    }
}
