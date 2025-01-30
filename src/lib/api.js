const host = 'https://thingsboard.gruenecho.de/api/';


/**
 * Thingsboard API
 * @class API
 * @classdesc API class for Thingsboard
 * */

class API{

    getToken(){
        const credentials = localStorage.getItem("credentials");
        try{
            const credentialsObj = JSON.parse(credentials);
		    return credentialsObj.token;
        } catch(e){
            return null;
        }
    }

    async login(username, password){
        const response = await fetch(`${host}auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username, password})
        });
        const data = await response.json();
        if(data.token){
            this.token = data.token;
            this.refreshToken = data.refreshToken;
        }
        localStorage.setItem("credentials", JSON.stringify(data));
        return data;

    }
    async refreshToken(){
        return new Promise((resolve, reject) => {
            const credentials = this.getToken();
            if(!credentials.refreshToken){
                reject('No refresh token');
            }
            console.log(credentials, {refreshToken: credentials.refreshToken});
            fetch(`${host}auth/token`, {
                method: 'POST',
                headers: {
                    //'X-Authorization': `Bearer ${credentials.refreshToken}`
                },
                body: JSON.stringify({refreshToken: credentials.refreshToken})
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        console.log('refreshToken', data);
                        //localStorage.setItem("credentials", JSON.stringify(data));
                        resolve(data);
                    });
                }else{
                    reject(response.statusText);
                }
            }).catch(e => {
                reject(e);
            });
        });
    }
    async getDevices(){
        const requestUrl = `${host}tenant/devices?pageSize=100&page=0`;
        return new Promise((resolve, reject) => {
            fetch(requestUrl, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        localStorage.setItem(requestUrl, JSON.stringify(data.data));
                        resolve(data.data);
                    });
                }else{
                    console.log('response.statusText');
                    const _local = localStorage.getItem(requestUrl);
                    if(_local){
                        resolve(JSON.parse(_local));
                    }else{
                        reject(response.statusText);
                    }
                }
            }).catch(e => {
                console.log('catch');
                const _local = localStorage.getItem(requestUrl);
                if(_local){
                    resolve(JSON.parse(_local));
                }else{
                    reject(e);
                }
            });
        });
    }
    async getDeviceByName(deviceName){
        const requestUrl = `${host}tenant/devices?deviceName=${deviceName}`;
        return new Promise((resolve, reject) => {
            fetch(requestUrl, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        localStorage.setItem(requestUrl, JSON.stringify(data));
                        resolve(data);
                    });
                }else{
                    
                    if(response.status === 401){
                        this.refreshToken().then(() => {
                            this.getDeviceByName(deviceName).then(data => {
                                resolve(data);
                            }).catch(e => {
                                const _local = localStorage.getItem(requestUrl);
                                if(_local){
                                    resolve(JSON.parse(_local));
                                }else{
                                    reject(e);
                                }
                            });
                        }).catch(e => {
                            reject(e);
                        });
                    }else{
                        reject(response.statusText);
                    }
                }
            }).catch(e => {
                console.log('catch');
                const _local = localStorage.getItem(requestUrl);
                if(_local){
                    resolve(JSON.parse(_local));
                }else{
                    reject(e);
                }
            });
        });
    }
    // http(s)://host:port/api/plugins/telemetry/{entityType}/{entityId}/keys/timeseries
    async getTelemetry(deviceId, startTs, endTs, key){
        const requestUrl = `${host}plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=${key}&startTs=${startTs}&endTs=${endTs}&limit=10`;
        return new Promise((resolve, reject) => {
            fetch(requestUrl, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        localStorage.setItem(requestUrl, JSON.stringify(data));
                        resolve(data);
                    });
                }else{
                    const _local = localStorage.getItem(requestUrl);
                    if(_local){
                        resolve(JSON.parse(_local));
                    }else{
                        reject(response.statusText);
                    }
                }
            }).catch(e => {
                const _local = localStorage.getItem(requestUrl);
                if(_local){
                    resolve(JSON.parse(_local));
                }else{
                    reject(e);
                }
            });
        });
    }
    async getAttributes(deviceId){
        const requestUrl = `${host}plugins/telemetry/DEVICE/${deviceId}/values/attributes`;
        return new Promise((resolve, reject) => {
            fetch(requestUrl, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        localStorage.setItem(requestUrl, JSON.stringify(data));
                        resolve(data);
                    });
                }else{
                    const _local = localStorage.getItem(requestUrl);
                    if(_local){
                        resolve(JSON.parse(_local));
                    }else{
                        reject(response.statusText);
                    }
                }
            }).catch(e => {
                const _local = localStorage.getItem(requestUrl);
                if(_local){
                    resolve(JSON.parse(_local));
                }else{
                    reject(e);
                }
            });
        });
    }
    async getKeys(deviceId){
        const requestUrl = `${host}plugins/telemetry/DEVICE/${deviceId}/keys/timeseries`;
        return new Promise((resolve, reject) => {
            fetch(requestUrl, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        localStorage.setItem(requestUrl, JSON.stringify(data));
                        resolve(data);
                    });
                }else{
                    const _local = localStorage.getItem(requestUrl);
                    if(_local){
                        resolve(JSON.parse(_local));
                    }else{
                        reject(response.statusText);
                    }
                }
            });
        });
    }
    async getDeviceCredentials(deviceId){
        const requestUrl = `${host}device/${deviceId}/credentials`;
        return new Promise((resolve, reject) => {

            const _local = localStorage.getItem(requestUrl);
            if(_local){
                resolve(JSON.parse(_local));
                return;
            }

            if(!deviceId){
                reject('Missing deviceId');
            }
            fetch(requestUrl, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        localStorage.setItem(requestUrl, JSON.stringify(data));
                        resolve(data);
                    });
                }else{
                    const _local = localStorage.getItem(requestUrl);
                    if(_local){
                        resolve(JSON.parse(_local));
                    }else{
                        reject(response.statusText);
                    }
                }
            });
        });
    }
    async getDevice(deviceId){
        const requestUrl = `${host}devices?deviceId=${deviceId}`;
        return new Promise((resolve, reject) => {
            fetch(`${host}devices?deviceId=${deviceId}`, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        localStorage.setItem(requestUrl, JSON.stringify(data));
                        resolve(data);
                    });
                }else{
                    const _local = localStorage.getItem(requestUrl);
                    if(_local){
                        resolve(JSON.parse(_local));
                    }else{
                        reject(response.statusText);
                    }
                }
            }).catch(e => {
                const _local = localStorage.getItem(requestUrl);
                if(_local){
                    resolve(JSON.parse(_local));
                }else{
                    reject(e);
                }
            });
        });
    }


    // LOCAL QUEUE
    getLocalQueue(){
        localStorage.getItem('localQueue') ? null : localStorage.setItem('localQueue', JSON.stringify([]));
        return JSON.parse(localStorage.getItem('localQueue'));
    }
    async sendLocalQueue(deviceId, values){
        // curl -v -X POST http://thingsboard.gruenecho.de:8080/api/v1/sP8MLOoRaqVkrN3d0a65/telemetry --header Content-Type:application/json --data "{temperature:25}"
        return new Promise((resolve, reject) => {
            if(!deviceId || !values){
                reject('Missing parameters');
            }
            fetch(`${host}v1/${deviceId}/telemetry`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': `Bearer ${this.getToken()}`
                },
                body: JSON.stringify(values)
            }).then(response => {
                if(response.ok){
                    resolve('Local queue sent');
                }else{
                    reject(response.statusText);
                }
            }).catch(e => {
                reject(e);
            });
        });
    }
    async syncLocalQueue(){
        return new Promise((resolve, reject) => {
            const localQueue = this.getLocalQueue();
            if(localQueue){
                const promises = [];
                localQueue.forEach(async device => {
                    try{
                        const deviceCredentials = await this.getDeviceCredentials(device.deviceId)
                        const credentialsId = deviceCredentials.credentialsId;
                        promises.push(this.sendLocalQueue(credentialsId, device.values));
                    } catch(e){
                        console.log(e);
                    }
                    
                });
                Promise.all(promises).then((res) => {
                    localStorage.setItem('localQueue', JSON.stringify([]));
                    resolve('Local queue synced');
                }).catch(e => {
                    reject(e);
                });
            }else{
                reject('No local queue');
            }
        });
    }
    async addKeyValueTolocalQueue(deviceId, key, value){
        return new Promise(async (resolve, reject) => {
            if(!deviceId || !key || !value){
                reject('Missing parameters');
            }
            const valueToBeAdded = {ts: Date.now()};
            valueToBeAdded.values = {};
            valueToBeAdded.values[key] = value;
            
            console.log(deviceId);
            const deviceValue = {
                deviceId: deviceId,
                values: valueToBeAdded
            }

            localStorage.getItem('localQueue') ? null : localStorage.setItem('localQueue', JSON.stringify([]));
            const localQueue = JSON.parse(localStorage.getItem('localQueue'));
            localQueue.push(deviceValue);
            localStorage.setItem('localQueue', JSON.stringify(localQueue));
            resolve('Added to local queue');
        });
    }
    async getLocalQueueByDeviceId(deviceId){
        return new Promise((resolve, reject) => {
            const localQueue = this.getLocalQueue();
            if(localQueue){
                const deviceQueue = localQueue.filter(device => device.deviceId === deviceId);
                resolve(deviceQueue);
            }else{
                reject('No local queue');
            }
        });
    }
    /*async get(url){
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }
    async post(url, data){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const responseData = await response.json();
        return responseData;
    }*/
}
export default new API();