pipeline {
    agent any

    stages {
        stage('Test Pipeline') {
            steps {
                echo 'SecureTask DevSecOps Pipeline fonctionne !'
            }
        }

        stage('Check Gitleaks') {
            steps {
                bat 'gitleaks version'
            }
        }
    }
}