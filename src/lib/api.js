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
        return data;

    }
    async getDevices(){
        return new Promise((resolve, reject) => {
            fetch(`${host}tenant/devices?pageSize=100&page=0`, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        resolve(data.data);
                    });
                }else{
                    reject(response.statusText);
                }
            });
        });
    }
    async getDeviceByName(deviceName){
        return new Promise((resolve, reject) => {
            fetch(`${host}tenant/devices?deviceName=${deviceName}`, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        resolve(data);
                    });
                }else{
                    reject(response.statusText);
                }
            });
        });
    }
    // http(s)://host:port/api/plugins/telemetry/{entityType}/{entityId}/keys/timeseries
    async getTelemetry(deviceId, startTs, endTs){
        return new Promise((resolve, reject) => {
            console.log(`${host}plugins/telemetry/DEVICE/${deviceId}/values/timeseries?startTs=${startTs}&endTs=${endTs}`)
            fetch(`${host}plugins/telemetry/DEVICE/${deviceId}/values/timeseries?keys=CycleCounter&startTs=${startTs}&endTs=${endTs}&limit=10`, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        resolve(data);
                    });
                }else{
                    reject(response.statusText);
                }
            });
        });
    }
    async getDevice(deviceId){
        return new Promise((resolve, reject) => {
            fetch(`${host}devices?deviceId=${deviceId}`, {
                headers: {
                    'X-Authorization': `Bearer ${this.getToken()}`
                }
            }).then(response => {
                if(response.ok){
                    response.json().then(data => {
                        resolve(data);
                    });
                }else{
                    reject(response.statusText);
                }
            });
        });
    }
    async get(url){
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
    }
}
export default new API();