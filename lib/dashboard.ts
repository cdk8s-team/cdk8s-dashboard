import { Construct, Node } from "constructs";
import * as k8s from '../imports/k8s';

export interface DashboardOptions {
  /**
   * Repository for container image.
   * @default "k8s.gcr.io/kubernetes-dashboard-amd64"
   */
  readonly imageRepository?: string;

  /**
   * Image tag.
   * @default "v1.10.1"
   */
  readonly imageTag?: string;

  /**
   * Image pull policy.
   * @default "IfNotPresent"
   */
  readonly imagePullPolicy?: string;

  /**
   * Image pull secrets.
   * @default []
   */
  readonly imagePullSecrets?: string[];

  /**
   * Number of replicas.
   * @default 1
   */
  readonly replicaCount?: number;

  /**
   * Annotations for deployment.
   * @default - none
   */
  readonly annotations?: Record<string, string>;

  /**
   * Labels for deployment.
   * @default - no additional labels
   */
  readonly labels?: Record<string, string>;

  /**
   * Annotations to be added to pods
   */
  readonly podAnnotations?: Record<string, string>;

  /**
   * Additional container arguments.
   * @default []
   */
  readonly extraArgs?: string[];

  /**
   * Additional container environment variables.
   * @default []
   */
  readonly extraEnv?: k8s.EnvVar[];

  /**
   * SecurityContext for the kubernetes dashboard container.
   * @default - none
   */
  readonly dashboardContainerSecurityContext?: k8s.SecurityContext;

  /**
   * Node labels for pod assignment
   */
  readonly nodeSelector?: Record<string, string>;

  /**
   * List of node taints to tolerate (requires Kubernetes >= 1.6).
   * @default []
   */
  readonly tolerations?: string[];

  /**
   * Name of Priority Class to assign pods.
   * @default - none
   */
  readonly priorityClassName?: string;

  /**
   * Enable possibility to skip login.
   */
  readonly enableSkipLogin?: boolean;

  /**
   * Serve application over HTTP without TLS.
   * @default false
   */
  readonly enableInsecureLogin?: boolean;

  /**
   * Dashboard external port
   * @default 443
   */
  readonly serviceExternalPort?: number;

  /**
   * Dashboard internal port
   * @default 443
   */
  readonly serviceInternalPort?: number;

  /**
   * List of IP CIDRs allowed access to load balancer (if supported).
   * @default []
   */
  readonly serviceLoadBalancerSourceRanges?: string[];

  /**
   * Add custom labels.
   * @default
   */
  readonly ingressLabels?: Record<string, string>;

  /**
   * Specify ingress class
   * @default - { "kubernetes.io/ingress.class": "nginx" }
   */
  readonly ingressAnnotations?: Record<string, string>;

  /**
   * Enable ingress controller resource.
   * @default false
   */
  readonly ingressEnabled?: boolean;

  /**
   * Paths to match against incoming requests. Both `/` and `/*` are required to
   * work on gce ingress.
   * 
   * @default - [ "/" ]
   */
  readonly ingressPaths?: string[];

  /**
   * Dashboard Hostnames.
   * @default []
   */
  readonly ingressHosts?: string[];

  /**
   * Ingress TLS configuration
   */
  readonly ingressTls?: boolean;

  /**
   * Pod resource requests & limits.
   * @default - { limits: {cpu: 100m, memory: 100Mi}, requests: {cpu: 100m, memory: 100Mi} }
   */
  readonly resources?: k8s.ResourceRequirements;

  /**
   * Create & use RBAC resources.
   * @default true
   */
  readonly rbacCreate?: boolean;

  /**
   * "cluster-admin" ClusterRole will be used for dashboard ServiceAccount (NOT
   * RECOMMENDED).
   * @default false
   */
  readonly rbacClusterAdminRole?: boolean;

  /**
   * If clusterAdminRole disabled, an additional role will be created with read
   * only permissions to all resources listed inside.
   * 
   * @default false
   */
  readonly rbacClusterReadOnlyRole?: boolean;

  /**
   * Whether a new service account name that the agent will use should be
   * created.  
   * @default true
   */
  readonly serviceAccountCreate?: boolean;

  /**
   * Service account to be used. 
   *
   * @default - If not set and serviceAccount.create is true a name is generated
   * using the fullname template.
   */
  readonly serviceAccountName?: string;

  /**
   * Number of seconds to wait before sending first probe.
   * @default 30
   */
  readonly livenessProbeInitialDelaySeconds?: number;

  /**
   * Number of seconds to wait for probe response
   * @default 30
   */
  readonly livenessProbeTimeoutSeconds?: number;

  /**
   * Create a PodDisruptionBudget
   * @default false
   */
  readonly podDisruptionBudgetEnabled?: boolean;

  /**
   * Minimum available instances; ignored if there is no PodDisruptionBudget
   */
  readonly podDisruptionBudgetMinAvailable?: number;

  /**
   * Maximum unavailable instances; ignored if there is no PodDisruptionBudget
   */
  readonly podDisruptionBudgetMaxUnavailable?: number;

  /**
   * PodSecurityContext for pod level securityContext 
   * @default - none
   */
  readonly securityContext?: k8s.PodSecurityContext;

  /**
   * Whether to create a network policy that allows access to the service 
   * @default false
   */
  readonly networkPolicy?: boolean;
}

/*
securityContext	PodSecurityContext for pod level securityContext	{}
networkPolicy	Whether to create a network policy that allows access to the service	false

*/

export class Dashboard extends Construct {
  constructor(scope: Construct, id: string, options: DashboardOptions = { }) {
    super(scope, id);

    const dashboardCertsSecretName = 

    const selectorLabels = {
      app: Node.of(this).uniqueId
    };

    new k8s.Deployment(this, 'deployment', {
      metadata: {
        annotations: options.annotations,
        labels: {
          ...selectorLabels,
          ...options.labels
        }
      },
      spec: {
        replicas: options.replicaCount ?? 1,
        strategy: {
          type: 'RollingUpdate',
          rollingUpdate: {
            maxSurge: 0,
            maxUnavailable: 1,
          }
        },
        selector: {
          matchLabels: selectorLabels
        },
        template: {
          metadata: {
            annotations: options.podAnnotations,
            labels: {
              ...selectorLabels,
            }
          },
          spec: {
            securityContext: options.securityContext,
            serviceAccountName: options.serviceAccountName, // {{ template "kubernetes-dashboard.serviceAccountName" . }}
            imagePullSecrets: options.imagePullSecrets?.map(name => ({ name })),
            nodeSelector: options.nodeSelector,
            priorityClassName: options.priorityClassName,
            volumes: [
              {
                name: 'kubernetes-dashboard-certs',
                secret: {
                  secretName: dashboardCertsSecretName
                }
              }
            ],
            containers: [
              {
                name: 'kubernetes-dashboard',
                image: `${options.imageRepository ?? 'k8s.gcr.io/kubernetes-dashboard-amd64'}:${options.imageTag ?? 'v1.10.1'}`,
                imagePullPolicy: options.imagePullPolicy ?? 'IfNotPresent',
                args: [
                  ...options.enableSkipLogin ? [ '--enable-skip-login' ] : [],
                  ...options.enableInsecureLogin ? [ '--enable-insecure-login' ] : [ '--auto-generate-certificates' ],
                  ...options.extraArgs ?? [],
                ],
                env: options.extraEnv,
                ports: [
                  options.enableInsecureLogin 
                    ? { name: 'http', containerPort: 9090, protocol: 'TCP' }
                    : { name: 'https', containerPort: 8443, protocol: 'TCP' }
                ],
                volumeMounts: [
                  {
                    name: 'kubernetes-dashboard-certs',
                    mountPath: '/certs',
                  },
                  {
                    name: 'tmp-volume',
                    mountPath: '/tmp',
                  }
                ],
                livenessProbe: {
                  httpGet: options.enableInsecureLogin
                    ? { scheme: 'HTTP', path: '/', port: 9090 }
                    : { scheme: 'HTTPS', path: '/', port: 8443 },
                  initialDelaySeconds: options.livenessProbeInitialDelaySeconds ?? 30,
                  timeoutSeconds: options.livenessProbeTimeoutSeconds ?? 30,
                },
                securityContext: options.dashboardContainerSecurityContext,
                resources: options.resources ?? { 
                  limits: { cpu: '100m', memory: '100Mi' }, 
                  requests: { cpu: '100m', memory: '100Mi' } 
                },
              },
            ]
          }
        }
      }
    });
  }
}

