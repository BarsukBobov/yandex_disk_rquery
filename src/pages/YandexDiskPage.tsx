import React, {useEffect, useRef, useState} from 'react';
import axios, {AxiosError} from "axios";
import {Item, Resources} from "../types/YandexDiskApi/resources";
import {useQuery} from "react-query";
import {Upload} from "../types/YandexDiskApi/upload";
import {make_size} from "../function/YandexDisk";
import {render} from "react-dom";

interface IProgress{
    id: number;
    progress: number;
    finished: boolean;
}

interface IFile{
    id: number;
    file: File;
}

const YandexDiskPage = () => {
    console.log("renderYandexDiskPage")
    const inputFile = useRef<HTMLInputElement>(null);
    const [path, setPath]=useState("/")
    const [Files, setFiles]=useState<IFile[]>([])
    const [root, setRoot]=useState(true)
    const [progresses, setProgress] = useState<IProgress[]>([]);
    const {data, isLoading, isError, error, refetch} = useQuery(
        ["items", path], ()=>
            fetchResources(path),
        {
            keepPreviousData: false
        })

    const onButtonClick = () => {
        const current= inputFile.current
        current?.click();
    };
    async function fetchResources(path:string):Promise<Item[]>{
        const config={
            headers: {
                'Accept': 'application/json',
                'Authorization': 'OAuth y0_AgAAAAA8SCcyAADLWwAAAADo63IbdaS_FcYLT9-t_Onx0ZbtkQ3ZP5k'
            },
            params:{
                path: path
            }
        }
        const url="https://cloud-api.yandex.net/v1/disk/resources?"

        const {data} = await axios.get<Resources>(url, config)
        return data._embedded.items
    }
    // async function sdf(path:string){
    //     const config={
    //         headers: {
    //             'Accept': 'application/json',
    //             'Authorization': 'OAuth y0_AgAAAAA8SCcyAADLWwAAAADo63IbdaS_FcYLT9-t_Onx0ZbtkQ3ZP5k1'
    //         },
    //         params:{
    //             path: path
    //         }
    //     }
    //     const url="https://cloud-api.yandex.net/v1/disk/resources?"
    //     try{
    //         const {data} = await axios.get<Resources>(url, config)
    //     }
    //     catch (e){
    //         const error= e as AxiosError
    //         console.log(error.response?.status)
    //     }
    // }
    // sdf("/")

    function create_path(name:string){
        if (root) setRoot(false)
        if (path==="/") return path+name
        else{
            return path+"/"+name
        }
    }

    function back(){
        const i=path.lastIndexOf("/")
        if (i===0) {
            setRoot(true)
            return "/"
        }
        return path.slice(0, i)
    }

    async function fetchUploadLink(path: string, file_i: IFile, onUploadProgress:any) {
        const file: File=file_i.file
        const config={
            headers: {
                'Accept': 'application/json',
                'Authorization': 'OAuth y0_AgAAAAA8SCcyAADLWwAAAADo63IbdaS_FcYLT9-t_Onx0ZbtkQ3ZP5k'
            },
            params:{
                path: path!=="/"?path+"/"+file.name:file.name
            },

        }
        const url="https://cloud-api.yandex.net/v1/disk/resources/upload?"
        const response = await axios.get<Upload>(url, config)
        const update_url=response.data.href
        const config2={
            onUploadProgress
        }
        const response2=await axios.put(update_url, file, config2)

        console.log(progresses)
        const next_progresses = progresses.map((progress: IProgress) => {
            if (progress.id === file_i.id) {
                // Increment the clicked counter
                return {...progress, finished:true};
            } else {
                // The rest haven't changed
                return progress;
            }
        });
        console.log(next_progresses)
        setProgress(next_progresses);
        await refetch()
    }

    const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files= event.target.files as FileList;
        console.log(files)
        const max:number=files.length
        if (max>100){

            return
        }
        let l=[...progresses]
        let l2 =[...Files]
        for (let i=0; i<max;i++){
            l.push({ id: i, progress: 100, finished: false})
            l2.push({id: i, file: files[i]})
            // setFiles(oldArray=>[...oldArray, {id: i, file: files[i]}])
        }
        setFiles(l2)
        setProgress(l)
    }

    useEffect(()=>{
        console.log("Effect -fetchUploadLink")
        console.log(Files)
        for (let file of Files){
            fetchUploadLink(path, file, (event: ProgressEvent) => {
                Math.round((100 * event.loaded) / event.total)})
        }

        }, [Files])

        // }
        // for (let i=0; i<max;i++){
        //     l.push({ id: nextId++, name:files[i].name, progress: 100, finished: false})
        //     setProgress(l)
        //     // setProgress(oldArray=>[...oldArray, { id: i, name: files[i].name, progress: 100, finished: false}])
        //     fetchUploadLink(path, files[i], (event: ProgressEvent) => {
        //         const progress=  Math.round((100 * event.loaded) / event.total)
        //     })
            // const value:IProgress[]=[...progresses,{ id: i, progress: 100, finished: false}]
        // }
        // setProgress([...progresses,...l])
        // console.log(progresses)


    if (isError){
        const er= error as AxiosError
        const status=er.response?.status
        return <div className={"fetch_error"}>Нет доступа к Яндекс диску: {status}</div>
    }
    return (
        <div>
            <div className="table-responsive-lg" >
                <table className="table table-dark table-hover">
                    <thead>
                        <tr >
                            <th style={{cursor: "pointer", visibility:root?"hidden":"visible"}} onClick={() =>
                                setPath(back())} scope="row"><i className="bi bi-box-arrow-left"></i></th>
                            <th scope="col" id="col_1">{path}</th>
                            <th scope="col" id="col_2">Дата</th>
                            <th scope="col" id="col_3">Время</th>
                            <th scope="col" id="col_4">Размер</th>
                        </tr>
                    </thead>
                    <tbody>
                    {!isLoading?data?.map(item =>
                            <tr>
                                {item.type === "dir" ?<th scope="row"><i className="bi bi-folder"></i></th>
                                    : <th scope="row" ><i className="bi bi-file-earmark"></i></th>}
                                {item.type === "dir" ?
                                    <td id="col_1" onClick={()=>setPath(create_path(item.name))}
                                        style={{cursor: "pointer", }}>{item.name}</td>
                                    : <td id="col_1">{item.name}</td>}
                                <td id="col_2"> {String(item.modified)}</td>
                                <td id="col_3">{String(item.modified)}</td>
                                <td id="col_4">{item.size?make_size(item.size):null}</td>
                            </tr>
                    ): <div className="spinner-border load" role="status">
                    </div>
                    }
                    </tbody>
                </table>
            </div>
            {progresses.map(progress=>
                <div>
                    <div>{progress.id}</div>
                    <div className="progress my-3">
                        <div
                            className="progress-bar progress-bar-info" role="progressbar" aria-valuenow={progress.progress}
                            aria-valuemin={0} aria-valuemax={100}
                            style={{ width: progress.progress + "%" , backgroundColor: "#59698d"}}
                        >
                            <div style={{ backgroundColor: "inherit"}}>
                                <i style={{ height: "10px", width: "10px"}} className={!progress.finished?"spinner-border":"bi bi-check2"}>
                                </i> {progress.progress!==100?progress.progress+"%": !progress.finished?"Ожидание ответа сервера":"Завершено"}</div>
                        </div>
                    </div>
                </div>
            )}
            <div className={"upload"} onClick={onButtonClick}>
                <input type='file' id='file' multiple onChange={selectImage} ref={inputFile} style={{display: 'none'}}/>
                <i className="bi bi-upload"></i>
            </div>
        </div>
    )
};

export default YandexDiskPage;