import React, { useEffect, useRef, useState} from 'react';
import axios, {AxiosError} from "axios";
import {Item, Resources} from "../types/YandexDiskApi/resources";
import {useQuery} from "react-query";
import {Upload} from "../types/YandexDiskApi/upload";
import {get_date, get_time, make_size, resources_error, upload_error} from "../function/YandexDisk";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
var cancel_upload_array: any[]
var count_finished: number
var cancel_all: Boolean
interface IFile{
    id: number;
    file: File;
}


const YandexDiskPage = () => {
    console.log("renderYandexDiskPage")
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [path, setPath]=useState("/")
    const [Files, setFiles]=useState<IFile[]>([])
    const [root, setRoot]=useState(true)
    const {data, isLoading, isError, error, refetch} = useQuery(
        ["items", path], ()=>
            fetchResources(path),
        {
            keepPreviousData: false,
            refetchInterval: 10000
        })
    const inputFile = useRef<HTMLInputElement>(null);
    const cancelRef = useRef<Array<HTMLElement | null>>([])
    const itemsRef = useRef<Array<HTMLElement | null>>([])
    const onButtonClick = () => {
        const current= inputFile.current
        current?.click();
    };

    async function fetchResources(path:string):Promise<Item[]>{
        const config={
            headers: {
                'Accept': 'application/json',
                // 'Authorization': 'OAuth y0_AgAAAABwDCZRAApUiwAAAADqJFa_rX1LlZwnTbWQEME5t_imjYlDRzc',
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

    function cancel_all_upload(){
        cancel_all=true
        for (let el of cancel_upload_array){
            el.cancel()
        }
    }

    async function fetchUploadLink(path: string, file_i: IFile) {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        cancel_upload_array.push(source)
        console.log(cancel_upload_array)
        const cancel_el=cancelRef.current[file_i.id]
        if (!cancel_el) return;
        cancel_el.onclick=()=>source.cancel()
        const cancel_all_el:HTMLElement|null=document.querySelector("#CancelAll")
        cancel_all_el!.onclick=()=>cancel_all_upload()
        const file: File=file_i.file
        const current = itemsRef.current[file_i.id]
        const child=current?.firstElementChild
        const child2 = child?.lastChild
        const child3 = child?.firstElementChild
        if (!current || !child2||!child3) return;
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
        let update_url=null
        try {const response =  await axios.get<Upload>(url, config)
            update_url=response.data.href
        }
        catch (error){
            const er= error as AxiosError
            const status=er.response?.status
            console.log(status)
            if (!status) return
            const error_message= upload_error(status)
            console.log(error_message)
            current.style.width="100%"
            current.style.backgroundColor="#670909"
            child2.textContent=error_message
            child3.classList.remove("spinner-border")
            child3.classList.add("bi-exclamation-triangle-fill")
            cancel_el.style.display="none"
            count_finished++
            if (count_finished===Files.length){
                console.log("finish")
                setFiles([])
            }
        }
        if (!update_url) return

        const config2={
            onUploadProgress :(event: ProgressEvent) => {
                const percent=Math.round((100 * event.loaded) / event.total)
                if (percent===100) {
                    if (child2.textContent!=="Ожидание ответа сервера") {
                        child2.textContent="Ожидание ответа сервера"
                        current.style.width=`${percent}%`
                        cancel_el.style.display="none"
                    }
                    return
                }
                current.style.width=`${percent}%`
                child2.textContent=`${percent}%`
            },
            cancelToken: source.token
        }
        // @ts-ignore
        try{ await axios.put(update_url, file, config2)}
        catch (error) {
            if (axios.isCancel(error)){
                if (cancel_all) {
                    setFiles([])
                    return
                }
                console.log('Request canceled');
                count_finished++
                if (count_finished===Files.length) {
                    console.log("finish")
                    setFiles([])
                }
                else{cancel_el.parentElement!.parentElement!.style.display="none"}
                // else{setTimeout(()=>cancel_el.parentElement!.parentElement!.remove(), 1000)}
                return
            }
            else{
                const er = error as AxiosError
                console.log(er)
            }

        }

        await refetch()
        child2.textContent="Завершено"
        child3.classList.remove("spinner-border")
        child3.classList.add("bi-check2")
        count_finished++
        if (count_finished===Files.length){
            console.log("finish")
            setFiles([])
        }

    }

    const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files= event.target.files as FileList;
        const max:number=files.length
        if (max>100){
            handleShow()
            return
        }
        let l2 =[...Files]
        for (let i=0; i<max;i++){
            l2.push({id: i, file: files[i]})
        }
        setFiles(l2)
    }
    useEffect(()=>{
        document.documentElement.setAttribute('data-bs-theme','dark')
    },[])
    useEffect(()=>{

        console.log("Effect -fetchUploadLink")
        cancel_upload_array=[]
        count_finished=0
        cancel_all = false
        for (let file of Files){
                fetchUploadLink(path, file)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [Files]
    )

    if (isError){
        const er= error as AxiosError
        const status=er.response?.status
        if (!status) return null
        return <div className={"fetch_error"}>Нет доступа к Яндекс диску: {resources_error(status)}</div>
    }


    return (
        <div>
            <Modal  show={show} onHide={handleClose}  >
                <Modal.Header closeButton>
                    <Modal.Title>Отправка файлов</Modal.Title>
                </Modal.Header>
                <Modal.Body>Нельзя отправить более 100 файлов!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() =>{handleClose();onButtonClick()}}>
                        Отправить снова
                    </Button>
                </Modal.Footer>
            </Modal>
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
                                <td id="col_2"> {get_date(item.modified)}</td>
                                <td id="col_3">{get_time(item.modified)}</td>
                                <td id="col_4">{item.size?make_size(item.size):null}</td>
                            </tr>
                    ): <div className="spinner-border load" role="status">
                    </div>
                    }
                    </tbody>
                </table>
            </div>

            {Files.length>0?
            <div className={"upload_body"}>
                <div className={"upload_header"}>
                    <i id="CancelAll" className="bi bi-x-lg"></i>
                </div>
                <div className={"upload_list"}>
                    {Files.map((file, i)=>
                        <div >
                            <div style={{ display: "flex" , justifyContent:"space-between"}}>
                                <div className={"fileName"}>{file.file.name}</div>
                                <i  ref={el => cancelRef.current[i] = el} className="bi bi-x-lg"></i>
                            </div>
                            <div className="progress my-3" >
                                <div
                                    ref={el => itemsRef.current[i] = el}
                                    className="progress-bar progress-bar-info" role="progressbar"
                                    style={{ backgroundColor: "#59698d"}}
                                >
                                    <div className="progress-content" style={{ backgroundColor: "inherit"}} >
                                        <i style={{ height: "10px", width: "10px"}}  className="spinner-border">
                                        </i>
                                        <span></span></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            :
            <div className={"upload"} onClick={onButtonClick}>
                <input type='file' id='file' multiple onChange={selectImage} ref={inputFile} style={{display: 'none'}}/>
                <i className="bi bi-upload"></i>
            </div>
            }
        </div>
    )
};

export default YandexDiskPage;