export const make_size = (size: number):string =>{
    if (size/1024<1) return size+'Б'
    if (size/Math.pow(1024,2)<1) return Math.round(size/1024)+' КБ'
    if (size/Math.pow(1024,3)<1) return Math.round(size/Math.pow(1024,2))+' МБ'
    return Math.round(size/Math.pow(1024,3))+' ГБ'
}
