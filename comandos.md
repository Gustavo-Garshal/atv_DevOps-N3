(1) 
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl scale deployment loja-api --replicas=5 -n n3-gustavogarshal
    deployment.apps/loja-api scaled
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl get pods -n n3-gustavogarshal
    NAME                        READY   STATUS    RESTARTS   AGE
    loja-api-58c49d5946-68rrz   1/1     Running   0          16s
    loja-api-58c49d5946-79tlf   1/1     Running   0          16s
    loja-api-58c49d5946-8k4rs   1/1     Running   0          46m
    loja-api-58c49d5946-jp9bx   1/1     Running   0          16s
    loja-api-58c49d5946-rfg54   1/1     Running   0          46m
    mysql-6b6777cdc-4t47f       1/1     Running   0          14m
    redis-9b95675b-rlx9k        1/1     Running   0          46m
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl scale deployment loja-api --replicas=2 -n n3-gustavogarshal
    deployment.apps/loja-api scaled
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl get pods -n n3-gustavogarshal 
    NAME                        READY   STATUS    RESTARTS   AGE
    loja-api-58c49d5946-8k4rs   1/1     Running   0          47m
    loja-api-58c49d5946-rfg54   1/1     Running   0          47m
    mysql-6b6777cdc-4t47f       1/1     Running   0          15m
    redis-9b95675b-rlx9k        1/1     Running   0          47m


(2)
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl set image deployment/loja-api api=loja-api:2.0 -n n3-gustavogarshal
    deployment.apps/loja-api image updated
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl rollout status deployment/loja-api -n n3-gustavogarshal
    deployment "loja-api" successfully rolled out
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl rollout history deployment/loja-api -n n3-gustavogarshal
    deployment.apps/loja-api 
    REVISION  CHANGE-CAUSE
    1         <none>
    2         <none>
    alteração:
    {
    "servico": "loja-api",
    "versao": "2.0",
    "pod": "loja-api-84c5ffbf-s6864",
    "comentario": "Nova versão ta rodando top"
    }


(3)
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl set image deployment/loja-api api=nada-haver -n n3-gustavogarshal  
    deployment.apps/loja-api image updated
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl describe pod loja-api -n n3-gustavogarshal
    Name:             loja-api-54d7944757-n2jlm
    Namespace:        n3-gustavogarshal
    Priority:         0
    Service Account:  default
    Node:             docker-desktop/192.168.65.3
    Start Time:       Fri, 20 Nov 2026 17:50:07 -0400
    Labels:           app=loja-api
                    pod-template-hash=54d7944757
                    track=stable
    Annotations:      <none>
    Status:           Pending
    IP:               10.1.0.159
    IPs:
    IP:           10.1.0.159
    Controlled By:  ReplicaSet/loja-api-54d7944757
    Containers:
    api:
        Container ID:   
        Image:          nada-haver
        Image ID:       
        Port:           3000/TCP
        Host Port:      0/TCP
        State:          Waiting
        Reason:       ImagePullBackOff
        Ready:          False
        Restart Count:  0
        Limits:
        cpu:     300m
        memory:  256Mi
        Requests:
        cpu:      100m
        memory:   128Mi
        Liveness:   http-get http://:3000/health delay=10s timeout=3s period=10s #success=1 #failure=3
        Readiness:  http-get http://:3000/ready delay=0s timeout=3s period=5s #success=1 #failure=3
        Environment Variables from:
        loja-config  ConfigMap  Optional: false
        Environment:
        DB_PASSWORD:  <set to the key 'MYSQL_PASSWORD' in secret 'loja-secret'>  Optional: false
        Mounts:
        /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-9wnhg (ro)
    Conditions:
    Type                        Status
    PodReadyToStartContainers   True 
    Initialized                 True 
    Ready                       False 
    ContainersReady             False 
    PodScheduled                True 
    Volumes:
    kube-api-access-9wnhg:
        Type:                    Projected (a volume that contains injected data from multiple sources)
        TokenExpirationSeconds:  3607
        ConfigMapName:           kube-root-ca.crt
        Optional:                false
        DownwardAPI:             true
    QoS Class:                   Burstable
    Node-Selectors:              <none>
    Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                                node.kubernetes.io/unreachable:NoExecute op=Exists for 300s

    Name:             loja-api-84c5ffbf-s6864
    Namespace:        n3-gustavogarshal
    Priority:         0
    Service Account:  default
    Node:             docker-desktop/192.168.65.3
    Start Time:       Fri, 20 Nov 2026 16:42:32 -0400
    Labels:           app=loja-api
                    pod-template-hash=84c5ffbf
                    track=stable
    Annotations:      <none>
    Status:           Running
    IP:               10.1.0.158
    IPs:
    IP:           10.1.0.158
    Controlled By:  ReplicaSet/loja-api-84c5ffbf
    Containers:
    api:
        Container ID:   docker://e156f370c0c02f16ef4b2fc40447db8b94fd1cf2db02c9a47119a23ea267eb66
        Image:          loja-api:2.0
        Image ID:       docker-pullable://loja-api@sha256:5cc6613fec8b8708e6e8bc6a934d7f5778bc75561c8de403cfd36e70f36b9e98
        Port:           3000/TCP
        Host Port:      0/TCP
        State:          Running
        Started:      Fri, 20 Nov 2026 16:42:32 -0400
        Ready:          True
        Restart Count:  0
        Limits:
        cpu:     300m
        memory:  256Mi
        Requests:
        cpu:      100m
        memory:   128Mi
        Liveness:   http-get http://:3000/health delay=10s timeout=3s period=10s #success=1 #failure=3
        Readiness:  http-get http://:3000/ready delay=0s timeout=3s period=5s #success=1 #failure=3
        Environment Variables from:
        loja-config  ConfigMap  Optional: false
        Environment:
        DB_PASSWORD:  <set to the key 'MYSQL_PASSWORD' in secret 'loja-secret'>  Optional: false
        Mounts:
        /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-wqxng (ro)
    Conditions:
    Type                        Status
    PodReadyToStartContainers   True 
    Initialized                 True 
    Ready                       True 
    ContainersReady             True 
    PodScheduled                True 
    Volumes:
    kube-api-access-wqxng:
        Type:                    Projected (a volume that contains injected data from multiple sources)
        TokenExpirationSeconds:  3607
        ConfigMapName:           kube-root-ca.crt
        Optional:                false
        DownwardAPI:             true
    QoS Class:                   Burstable
    Node-Selectors:              <none>
    Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                                node.kubernetes.io/unreachable:NoExecute op=Exists for 300s

    Name:             loja-api-84c5ffbf-vhr8n
    Namespace:        n3-gustavogarshal
    Priority:         0
    Service Account:  default
    Node:             docker-desktop/192.168.65.3
    Start Time:       Fri, 20 Nov 2026 16:42:25 -0400
    Labels:           app=loja-api
                    pod-template-hash=84c5ffbf
                    track=stable
    Annotations:      <none>
    Status:           Running
    IP:               10.1.0.157
    IPs:
    IP:           10.1.0.157
    Controlled By:  ReplicaSet/loja-api-84c5ffbf
    Containers:
    api:
        Container ID:   docker://ce463c62e7503fc7047c8a42b1e9ea93291212085b7f1cc132dbcae7629f4e79
        Image:          loja-api:2.0
        Image ID:       docker-pullable://loja-api@sha256:5cc6613fec8b8708e6e8bc6a934d7f5778bc75561c8de403cfd36e70f36b9e98
        Port:           3000/TCP
        Host Port:      0/TCP
        State:          Running
        Started:      Fri, 20 Nov 2026 16:42:26 -0400
        Ready:          True
        Restart Count:  0
        Limits:
        cpu:     300m
        memory:  256Mi
        Requests:
        cpu:      100m
        memory:   128Mi
        Liveness:   http-get http://:3000/health delay=10s timeout=3s period=10s #success=1 #failure=3
        Readiness:  http-get http://:3000/ready delay=0s timeout=3s period=5s #success=1 #failure=3
        Environment Variables from:
        loja-config  ConfigMap  Optional: false
        Environment:
        DB_PASSWORD:  <set to the key 'MYSQL_PASSWORD' in secret 'loja-secret'>  Optional: false
        Mounts:
        /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-zwhnk (ro)
    Conditions:
    Type                        Status
    PodReadyToStartContainers   True 
    Initialized                 True 
    Ready                       True 
    ContainersReady             True 
    PodScheduled                True 
    Volumes:
    kube-api-access-zwhnk:
        Type:                    Projected (a volume that contains injected data from multiple sources)
        TokenExpirationSeconds:  3607
        ConfigMapName:           kube-root-ca.crt
        Optional:                false
        DownwardAPI:             true
    QoS Class:                   Burstable
    Node-Selectors:              <none>
    Tolerations:                 node.kubernetes.io/not-ready:NoExecute op=Exists for 300s
                                node.kubernetes.io/unreachable:NoExecute op=Exists for 300s

    O pod loja-api-54d7944757-n2jlm ta com uma imagem que não existe e por conta disso a atualização não avançou e não aplicou nos outros pods

    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl rollout undo deployment loja-api -n n3-gustavogarshal
    Warning: resource deployments/loja-api was previously managed with 'kubectl apply'. Rolling back will not update the kubectl.kubernetes.io/last-applied-configuration annotation, which may cause unexpected behavior on future 'kubectl apply' operations. Consider using 'kubectl apply' with your previous configuration file instead.
    deployment.apps/loja-api rolled back


(4)
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl set resources deployment loja-api --requests=cpu=10m,memory=16Mi --limits=cpu=30m,memory=64Mi -n n3-gustavogarshal
    deployment.apps/loja-api resource requirements updated
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl describe pod loja-api -n n3-gustavogarshal                         
    Name:             loja-api-86459f6c6-ds5dj
    Namespace:        n3-gustavogarshal
    Priority:         0
    Service Account:  default
    Node:             docker-desktop/192.168.65.3
    Start Time:       Fri, 20 Nov 2026 18:29:20 -0400
    Labels:           app=loja-api
                    pod-template-hash=86459f6c6
                    track=stable
    Annotations:      <none>
    Status:           Running
    IP:               10.1.0.168
    IPs:
    IP:           10.1.0.168
    Controlled By:  ReplicaSet/loja-api-86459f6c6
    Containers:
    api:
        Container ID:   docker://53b60af370e73c51d7ee54cb1db77612c979b166fe1879aaeaffc0f80dbef022
        Image:          loja-api:2.0
        Image ID:       docker-pullable://loja-api@sha256:5cc6613fec8b8708e6e8bc6a934d7f5778bc75561c8de403cfd36e70f36b9e98
        Port:           3000/TCP
        Host Port:      0/TCP
        State:          Running
        Started:      Fri, 20 Nov 2026 18:29:23 -0400
        Ready:          True
        Restart Count:  0
        Limits:
        cpu:     30m      //CPU como definido no set resources
        memory:  64Mi     //memoria como definido no set resources
        Requests:
        cpu:      10m
        memory:   16Mi
        Liveness:   http-get http://:3000/health delay=10s timeout=3s period=10s #success=1 #failure=3
        Readiness:  http-get http://:3000/ready delay=0s timeout=3s period=5s #success=1 #failure=3
        Environment Variables from:
        loja-config  ConfigMap  Optional: false
        Environment:
        DB_PASSWORD:  <set to the key 'MYSQL_PASSWORD' in secret 'loja-secret'>  Optional: false
        Mounts:
        /var/run/secrets/kubernetes.io/serviceaccount from kube-api-access-7tfwz (ro)


(5)
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl autoscale deployment loja-api --cpu=30% --min=2 --max=8 -n n3-gustavogarshal
    horizontalpodautoscaler.autoscaling/loja-api autoscaled
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl get hpa -n n3-gustavogarshal -w
    loja-api   Deployment/loja-api   cpu: 130%/30%        2         8         2          106s
    loja-api   Deployment/loja-api   cpu: 10%/30%         2         8         4          2m46s
    loja-api   Deployment/loja-api   cpu: 30%/30%         2         8         8          3m46s
    loja-api   Deployment/loja-api   cpu: 10%/30%         2         8         8          8m46s
    loja-api   Deployment/loja-api   cpu: 10%/30%         2         8         3          9m46s


(6)
    PS C:\Users\etern\OneDrive\Documentos\Faculdade\4_semestre\dev_ops\loja-k8s> kubectl describe node
    Name:               docker-desktop
    Roles:              control-plane
    Labels:             beta.kubernetes.io/arch=amd64
                        beta.kubernetes.io/os=linux
                        kubernetes.io/arch=amd64
                        kubernetes.io/hostname=docker-desktop
                        kubernetes.io/os=linux
                        node-role.kubernetes.io/control-plane=
                        node.kubernetes.io/exclude-from-external-load-balancers=
    Annotations:        node.alpha.kubernetes.io/ttl: 0
                        volumes.kubernetes.io/controller-managed-attach-detach: true
    CreationTimestamp:  Fri, 09 Oct 2026 20:13:57 -0400
    Taints:             <none>
    Unschedulable:      false
    Lease:
    HolderIdentity:  docker-desktop
    AcquireTime:     <unset>
    RenewTime:       Fri, 20 Nov 2026 19:00:08 -0400
    Conditions:
    Type             Status  LastHeartbeatTime                 LastTransitionTime                Reason                       Message
    ----             ------  -----------------                 ------------------                ------                       -------
    MemoryPressure   False   Fri, 20 Nov 2026 18:59:52 -0400   Fri, 09 Oct 2026 20:13:56 -0400   KubeletHasSufficientMemory   kubelet has sufficient memory available
    DiskPressure     False   Fri, 20 Nov 2026 18:59:52 -0400   Fri, 09 Oct 2026 20:13:56 -0400   KubeletHasNoDiskPressure     kubelet has no disk pressure
    PIDPressure      False   Fri, 20 Nov 2026 18:59:52 -0400   Fri, 09 Oct 2026 20:13:56 -0400   KubeletHasSufficientPID      kubelet has sufficient PID available
    Ready            True    Fri, 20 Nov 2026 18:59:52 -0400   Fri, 09 Oct 2026 20:13:58 -0400   KubeletReady                 kubelet is posting ready status
    Addresses:
    InternalIP:  192.168.65.3
    Hostname:    docker-desktop
    Capacity:
    //É a capacidade total do hardware, todo recurso que a máquina tem
        cpu:                16
        ephemeral-storage:  1055762868Ki
        hugepages-1Gi:      0
        hugepages-2Mi:      0
        memory:             7820964Ki
        pods:               110
    Allocatable:
    //São os recursos disponiveis para uso, o resto já esta reservado para partes fundamentais como o SO e outros componentes.
        cpu:                16
        ephemeral-storage:  972991057538
        hugepages-1Gi:      0
        hugepages-2Mi:      0
        memory:             7718564Ki
        pods:               110
    System Info:
    Machine ID:                 7df5be83d4b348ebbd5b57d2e6e9dfc4
    System UUID:                7df5be83d4b348ebbd5b57d2e6e9dfc4
        Boot ID:                    31496150-7bee-4024-8004-0c5b7fe32cd7
        Kernel Version:             6.18.33.1-microsoft-standard-WSL2
        OS Image:                   Docker Desktop
        Operating System:           linux
        Architecture:               amd64
        Container Runtime Version:  docker://29.9.3
        Kubelet Version:            v1.36.1
    Non-terminated Pods:          (18 in total)
    Namespace                   Name                                      CPU Requests  CPU Limits  Memory Requests  Memory Limits  Age
    ---------                   ----                                      ------------  ----------  ---------------  -------------  ---
    aula03                      carga-6f84fbd6d7-mt5z7                    0 (0%)        0 (0%)      0 (0%)           0 (0%)         6d21h
    aula03                      web-6dcf78846b-fznr2                      1 (6%)        10 (62%)    16Mi (0%)        64Mi (0%)      6d21h
    aula03                      web-6dcf78846b-xjlg6                      1 (6%)        10 (62%)    16Mi (0%)        64Mi (0%)      6d21h
    kube-system                 coredns-589f44dc88-4rgxm                  100m (0%)     0 (0%)      70Mi (0%)        170Mi (2%)     41d
    kube-system                 coredns-589f44dc88-nz5kp                  100m (0%)     0 (0%)      70Mi (0%)        170Mi (2%)     41d
    kube-system                 etcd-docker-desktop                       100m (0%)     0 (0%)      100Mi (1%)       0 (0%)         41d
    kube-system                 kube-apiserver-docker-desktop             250m (1%)     0 (0%)      0 (0%)           0 (0%)         41d
    kube-system                 kube-controller-manager-docker-desktop    200m (1%)     0 (0%)      0 (0%)           0 (0%)         41d
    kube-system                 kube-proxy-f76mw                          0 (0%)        0 (0%)      0 (0%)           0 (0%)         41d
    kube-system                 kube-scheduler-docker-desktop             100m (0%)     0 (0%)      0 (0%)           0 (0%)         41d
    kube-system                 metrics-server-7ddff8749b-vbm5q           100m (0%)     0 (0%)      200Mi (2%)       0 (0%)         6d23h
    kube-system                 storage-provisioner                       0 (0%)        0 (0%)      0 (0%)           0 (0%)         41d
    kube-system                 vpnkit-controller                         0 (0%)        0 (0%)      0 (0%)           0 (0%)         41d
    n3-gustavogarshal           loja-api-86459f6c6-ds5dj                  10m (0%)      30m (0%)    16Mi (0%)        64Mi (0%)      30m
    n3-gustavogarshal           loja-api-86459f6c6-jvlb8                  10m (0%)      30m (0%)    16Mi (0%)        64Mi (0%)      30m
    n3-gustavogarshal           loja-api-86459f6c6-scggc                  10m (0%)      30m (0%)    16Mi (0%)        64Mi (0%)      11m
    n3-gustavogarshal           mysql-6b6777cdc-9qmjk                     250m (1%)     1 (6%)      512Mi (6%)       768Mi (10%)    33m
    n3-gustavogarshal           redis-9b95675b-rlx9k                      50m (0%)      250m (1%)   64Mi (0%)        96Mi (1%)      3h16m
    Allocated resources:
    //São os recursos que estão sendo usados no momento pelo Node, e o limite maximo que já atingiram.
    (Total limits may be over 100 percent, i.e., overcommitted.)
    Resource           Requests      Limits
    --------           --------      ------
    cpu                3280m (20%)   21340m (133%) //Talvez exagerei um pouco nas cargas
    memory             1096Mi (14%)  1524Mi (20%)
    ephemeral-storage  0 (0%)        0 (0%)
    hugepages-1Gi      0 (0%)        0 (0%)
    hugepages-2Mi      0 (0%)        0 (0%)
    Events:              <none>