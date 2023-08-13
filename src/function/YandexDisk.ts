export const make_size = (size: number):string =>{
    if (size/1024<1) return size+'Б'
    if (size/Math.pow(1024,2)<1) return Math.round(size/1024)+' КБ'
    if (size/Math.pow(1024,3)<1) return Math.round(size/Math.pow(1024,2))+' МБ'
    return Math.round(size/Math.pow(1024,3))+' ГБ'
}

export const resources_error = (status: number):string =>{
    switch (status) {
        case 400:
            return "Некорректные данные."
        case 401:
            return "Не авторизован."
        case 403:
            return "API недоступно. Ваши файлы занимают больше места, чем у вас есть. Удалите лишнее или увеличьте объём Диска."
        case 404:
            return "Не удалось найти запрошенный ресурс."
        case 413:
            return "Загрузка файла недоступна. Файл слишком большой."
        case 423:
            return "Технические работы. Сейчас можно только просматривать и скачивать файлы."
        case 429:
            return "Слишком много запросов."
        case 503:
            return "Сервис временно недоступен."
        default:
            return "Неизвестная ошибка"
    }
}

export const upload_error = (status: number):string =>{
    switch (status) {
        case 400:
            return "Некорректные данные."
        case 401:
            return "Не авторизован."
        case 403:
            return "API недоступно. Ваши файлы занимают больше места, чем у вас есть. Удалите лишнее или увеличьте объём Диска."
        case 404:
            return "Не удалось найти запрошенный ресурс."
        case 409:
            return "Файл с таким названием уже существует."
        case 413:
            return "Загрузка файла недоступна. Файл слишком большой."
        case 423:
            return "Технические работы. Сейчас можно только просматривать и скачивать файлы."
        case 429:
            return "Слишком много запросов."
        case 503:
            return "Сервис временно недоступен."
        case 507:
            return "Сервис временно недоступен."
        default:
            return "Неизвестная ошибка"
    }
}
export const get_date = (date: string) =>{

    const date_date=new Date(date)
    let day:number|string= date_date.getDate()
    if (day<10) day="0"+day
    let month:number|string= date_date.getMonth()
    if (month<10) month="0"+month
    const year= date_date.getFullYear()
    return (`${day}.${month}.${year}`)
}

export const get_time = (date: string) =>{
    const date_date=new Date(date)
    const hours= date_date.getHours()
    const minutes= date_date.getMinutes()
    return (`${hours}:${minutes}`)
}