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
                    env.RELEASE_VERSION = latestTag
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
                        env.RELEASE_VERSION + currentBuild.number,
                        params.ENVIRONMENT
                    )
                }
            }
        }
        stage ('Deploy') {
            steps {
                script {
                    webDeploy(
                        params.AMPLIFY_APP_ID
                        env.RELEASE_VERSION + currentBuild.number,
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
