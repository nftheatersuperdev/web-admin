@Library('shared-jenkins-library@master') _

pipeline {
    agent { label "master" }
    tools { nodejs 'NodeJS' }

    parameters {
      string(name: 'RELEASE_VERSION', defaultValue: '0.0.1', description: 'Release Version')
    }

    stages {
        stage ('Get Latest Version') {
            steps {
                script {
                    latestTag = sh(returnStdout:  true, script: "git tag --sort=-creatordate | head -n 1").trim()
                    env.APP_VERSION = latestTag + "-" + currentBuild.number
                }
            }
        }
        stage ('Install Package') {
            steps {
                sh 'npm install'
            }
        }
        stage ('Build And Push Bundle To S3') {
            steps {
                script {
                    webBuildAndPushS3(
                        env.APP_VERSION,
                        params.ENVIRONMENT
                    )
                }
            }
        }
        stage ('Deploy') {
            steps {
                script {
                    webDeploy(
                        params.AMPLIFY_APP_ID,
                        env.APP_VERSION,
                        params.ENVIRONMENT
                    )
                }
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
