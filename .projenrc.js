const { JsiiProject } = require('projen');

const project = new JsiiProject({
  name: 'cdk8s-dashboard',
  description: 'Kubernetes dashboard construct library for cdk8s',

  repository: 'https://github.com/cdk8s-team/cdk8s-dashboard.git',
  defaultReleaseBranch: 'master',
  stability: 'experimental',

  authorName: 'Elad Ben-Israel',
  authorEmail: 'benisrae@amazon.com',

  peerDependencies: [
    'cdk8s@^0.20.0',
    'constructs@^2.0.1',
  ],

  publishToMaven: {
    javaPackage: 'com.github.eladb.cdk8s.dashboard',
    mavenGroupId: 'com.github.eladb',
    mavenArtifactId: 'cdk8s-dashboard',
  },

  publishToPypi: {
    distName: 'cdk8s-dashboard',
    module: 'cdk8s_dashboard',
  },

  publishToNuget: {
    dotNetNamespace: 'Eladb.Cdk8s.Dashboard',
    packageId: 'Eladb.Cdk8s.Dashboard',
  },
});

project.synth();
