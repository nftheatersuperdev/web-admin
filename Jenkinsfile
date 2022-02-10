pipeline {
    agent { label "master" }
    tools { nodejs 'NodeJS' }

    stages {
        stage ('Install Package') {
            steps {
                sh 'npm install'
            }
        }
        stage ('Copy Environment') {
             steps{
                sh "cp /var/lib/jenkins/workspace/.env /var/lib/jenkins/workspace/admin-web-tesla"
             }
        }
        stage ('Build Static File') {
            steps {
                sh 'npm run build'
            }
        }
        stage ('Zip') {
             steps{
                sh "cd build && zip -r admin-web.zip ./* && cd -"
             }
        }
        stage ('Upload to S3') {
             steps{
                sh "aws s3 cp ./build/admin-web.zip s3://admin-web-dev-test/admin-web.zip"
             }
        }
        stage ('Deploy') {
             steps{
                sh "aws amplify start-deployment --app-id d2nztmvn1ui6cz --branch-name dev --source-url=s3://admin-web-dev-test/admin-web.zip"
             }
        }
    }
}
