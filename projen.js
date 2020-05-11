const { JsiiProject, Semver } = require('projen');

const project = new JsiiProject({
  name: 'cdk8s-dashboard',
  jsiiVersion: Semver.caret('1.5.0'),
  description: 'Kubernetes dashboard construct library for cdk8s',
  repository: 'https://github.com/eladb/cdk8s-dashboard.git',
  authorName: 'Elad Ben-Israel',
  authorEmail: 'benisrae@amazon.com',
  stability: 'experimental',
  peerDependencies: {
    cdk8s: Semver.caret('0.20.0'),
    constructs: Semver.caret('3.0.3'),
  }
});

project.synth();

/*
    "targets": {
      "java": {
        "package": "com.github.eladb.cdk8s.dashboard",
        "maven": {
          "groupId": "com.github.eladb",
          "artifactId": "cdk8s-dashboard"
        }
      },
      "python": {
        "distName": "cdk8s-dashboard",
        "module": "cdk8s_dashboard"
      },
      "dotnet": {
        "namespace": "Eladb.Cdk8s.Dashboard",
        "packageId": "Eladb.Cdk8s.Dashboard"
      }
    }
*/