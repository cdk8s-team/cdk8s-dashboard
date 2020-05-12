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
    constructs: Semver.caret('2.0.1'),
  },
  java: {
    javaPackage: 'com.github.eladb.cdk8s.dashboard',
    mavenGroupId: 'com.github.eladb',
    mavenArtifactId: 'cdk8s-dashboard'
  },
  python: {
    distName: 'cdk8s-dashboard',
    module: 'cdk8s_dashboard'
  },
  dotnet: {
    dotNetNamespace: 'Eladb.Cdk8s.Dashboard',
    packageId: 'Eladb.Cdk8s.Dashboard'
  }
});

project.synth();
