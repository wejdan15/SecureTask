pipeline {
    agent any

    stages {

        stage('Test Pipeline') {
            steps {
                echo 'SecureTask DevSecOps Pipeline fonctionne !'
            }
        }

        stage('secrets_scan') {
            steps {
                bat '"C:\\Users\\telli\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gitleaks.Gitleaks_Microsoft.Winget.Source_8wekyb3d8bbwe\\gitleaks.exe" git . --redact'
            }
        }

        stage('sast') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    script {
                        def scannerHome = tool 'SonarScanner'
                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\" -Dsonar.projectKey=SecureTask -Dsonar.sources=src,backend"
                    }
                }
            }
        }

        stage('quality_gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('scan_dependencies') {
            steps {
                bat '"C:\\Users\\telli\\AppData\\Local\\Microsoft\\WinGet\\Links\\trivy.exe" fs --scanners vuln --severity HIGH,CRITICAL --exit-code 1 .'
            }
        }

        stage('docker_build') {
            steps {
                bat 'docker build -t securetask-backend ./backend'
            }
        }

    }
}