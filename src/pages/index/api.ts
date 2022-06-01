import { AvailableReservation, Reservation } from "./reservation"


// const host = 'https://service-908mprqb-1305763203.sh.apigw.tencentcs.com'
const host = process.env.NODE_ENV === 'development'?'http://localhost:9000':'https://service-908mprqb-1305763203.sh.apigw.tencentcs.com'

export const exists = async (openid:string)=>{
    return request<boolean>('/member/exists',{openid})
}

export const getAvailableReservation = async ()=>{
    return request<Array<AvailableReservation>>('/reservation')
}

export const getReservationByOpenID = async (openid?:string)=>{
    openid = openid == null?'':openid
    const result = await request<Array<Reservation>>('/reservation/getByOpenID',{
        openid
    })
    for (const r of result) {
        r.time = new Date(r.time)
    }
    return result
}

export const getReservation = async (shopId:string)=>{
    const result = await request<Array<Reservation>>('/reservation/all',{
        shopId
    })
    for (const r of result) {
        r.time = new Date(r.time)
    }
    return result
}

export const addReservation = async(openid:string,reservation:Reservation)=>{
    return request<string>('/reservation/add',{openid,...reservation},'POST')
}

export const cancelReservation = async(openid:string):Promise<Response>=>{
    return request<Response>('/reservation/cancel',{openid},'POST')
}

interface Response{
    updated:number
}

export const code2OpenID =async(code:string)=>{
    return request<string>('/reservation/code2OpenID',{code})
}

export const code2Phone =async(code:string,openid:string)=>{
    return request<Response>('/reservation/code2Phone',{code,openid})
}

const request = async<T>(url:string,data?:AnyObject,method?:'GET' | 'POST')=>{
    return new Promise<T>((resolve,reject)=>{
        uni.request({
            url:host+url,
            data,
            method,
            success:(res)=>{
             resolve(res.data as T)
            },
            fail:()=>{
                reject()
            }
        })
    }) 
}