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
    }
}