import React, {useEffect, useRef, useState} from 'react';
import axios, {AxiosError} from "axios";
import {Item, Resources} from "../types/YandexDiskApi/resources";
import {useQuery} from "react-query";
import {Upload} from "../types/YandexDiskApi/upload";
import {get_date, get_time, make_size, resources_error, upload_error} from "../function/YandexDisk";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useTypedSelector} from "../hooks/useTypedSelector";
import {useActions} from "../hooks/useActions";
import {Navigate} from "react-router-dom";
import {Download} from "../types/YandexDiskApi/download";

var cancel_upload_array: any[]
var count_finished: number
var cancel_all: Boolean

interface IFile {
    id: number;
    file: File;
}


const YandexDiskPage = () => {
    console.log("renderYandexDiskPage")
    const [show, setShow] = useState(false);
    const [modal_del, setModal_del] = useState(false);
    const [path, setPath] = useState("/")
    const [choice, setChoice] = useState(false)
    const [Files, setFiles] = useState<IFile[]>([])
    const [root, setRoot] = useState(true)
    const inputFile = useRef<HTMLInputElement>(null);
    const cancelRef = useRef<Array<HTMLElement | null>>([])
    const itemsRef = useRef<Array<HTMLElement | null>>([])
    const {token} = useTypedSelector(state => state.login)
    const {logout} = useActions()
    const {data, isLoading, isError, error, refetch} = useQuery(
        ["items", path], () =>
            fetchResources(path),
        {
            keepPreviousData: false,
            refetchInterval: 10000
        })
    const onButtonClick = () => {
        const current = inputFile.current
        current?.click();
    };

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', 'dark')
    }, [])

    useEffect(() => {
            console.log("Effect -fetchUploadLink")
            cancel_upload_array = []
            count_finished = 0
            cancel_all = false
            for (let file of Files) {
                fetchUploadLink(path, file)
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [Files]
    )

    async function fetchResources(path: string): Promise<Item[]> {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `OAuth ${token}`
            },
            params: {
                path: path
            }
        }
        const url = "https://cloud-api.yandex.net/v1/disk/resources?"

        const {data} = await axios.get<Resources>(url, config)
        return data._embedded.items
    }

    function create_path(name: string) {
        if (root) setRoot(false)
        if (path === "/") return path + name
        else {
            return path + "/" + name
        }
    }

    function back() {
        const i = path.lastIndexOf("/")
        if (i === 0) {
            setRoot(true)
            return "/"
        }
        return path.slice(0, i)
    }

    function cancel_all_upload() {
        cancel_all = true
        for (let el of cancel_upload_array) {
            el.cancel()
        }
    }

    async function fetchUploadLink(path: string, file_i: IFile) {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        cancel_upload_array.push(source)
        console.log(cancel_upload_array)
        const cancel_el = cancelRef.current[file_i.id]
        if (!cancel_el) return;
        cancel_el.onclick = () => source.cancel()
        const cancel_all_el: HTMLElement | null = document.querySelector("#CancelAll")
        cancel_all_el!.onclick = () => cancel_all_upload()
        const file: File = file_i.file
        const current = itemsRef.current[file_i.id]
        const child = current?.firstElementChild
        const child2 = child?.lastChild
        const child3 = child?.firstElementChild
        if (!current || !child2 || !child3) return;
        const config = {
            headers: {
                'Accept': 'application/json',
                'Authorization': `OAuth ${token}`
            },
            params: {
                path: path !== "/" ? path + "/" + file.name : file.name
            },
        }
        const url = "https://cloud-api.yandex.net/v1/disk/resources/upload?"
        let update_url = null
        try {
            const response = await axios.get<Upload>(url, config)
            update_url = response.data.href
        } catch (error) {
            const er = error as AxiosError
            const status = er.response?.status
            console.log(status)
            if (!status) return
            const error_message = upload_error(status)
            console.log(error_message)
            current.style.width = "100%"
            current.style.backgroundColor = "#670909"
            child2.textContent = error_message
            child3.classList.remove("spinner-border")
            child3.classList.add("bi-exclamation-triangle-fill")
            cancel_el.style.display = "none"
            count_finished++
            if (count_finished === Files.length) {
                setFiles([])
            }
        }
        if (!update_url) return

        const config2 = {
            onUploadProgress: (event: ProgressEvent) => {
                const percent = Math.round((100 * event.loaded) / event.total)
                if (percent === 100) {
                    if (child2.textContent !== "Ожидание ответа сервера") {
                        child2.textContent = "Ожидание ответа сервера"
                        current.style.width = `${percent}%`
                        cancel_el.style.display = "none"
                    }
                    return
                }
                current.style.width = `${percent}%`
                child2.textContent = `${percent}%`
            },
            cancelToken: source.token
        }

        try {
            // @ts-ignore
            await axios.put(update_url, file, config2)
        } catch (error) {
            if (axios.isCancel(error)) {
                if (cancel_all) {
                    setFiles([])
                    return
                }
                count_finished++
                if (count_finished === Files.length) {
                    setFiles([])
                } else {
                    cancel_el.parentElement!.parentElement!.style.display = "none"
                }
                // else{setTimeout(()=>cancel_el.parentElement!.parentElement!.remove(), 1000)}
                return
            } else {
                const er = error as AxiosError
                console.log(er)
            }

        }

        await refetch()
        child2.textContent = "Завершено"
        child3.classList.remove("spinner-border")
        child3.classList.add("bi-check2")
        count_finished++
        if (count_finished === Files.length) {
            setFiles([])
        }

    }

    const selectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files as FileList;
        const max: number = files.length
        if (max > 100) {
            setShow(true)
            return
        }
        let l2 = [...Files]
        for (let i = 0; i < max; i++) {
            l2.push({id: i, file: files[i]})
        }
        setFiles(l2)
    }


    async function delete_files() {
        const checkboxs: NodeListOf<HTMLElement> = document.querySelectorAll("tbody .form-check-input")
        if (!checkboxs) return
        let l: string[] = []
        checkboxs.forEach((checkbox) => {
                // @ts-ignore
                if (checkbox.checked) l.push(checkbox.getAttribute("value"))
            }
        )
        setChoice(false)
        for (let del_path of l) {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `OAuth ${token}`
                },
                params: {
                    path: del_path,
                    force_async: true
                },
            }
            const url = "https://cloud-api.yandex.net/v1/disk/resources"
            try {
                const response = await axios.delete(url, config)
                console.log(response)
            } catch (error) {
                const er = error as AxiosError
                const status = er.response?.status
                console.log(status)
            }
        }
        setModal_del(false)
        await refetch()
    }

    function downloadURI(uri: string) {
        let link = document.createElement("a");
        link.download = "name";
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async function download_all(){
        const checkboxs: NodeListOf<HTMLElement> = document.querySelectorAll("tbody .form-check-input")
        if (!checkboxs) return
        let l: string[] = []
        checkboxs.forEach((checkbox) => {
                // @ts-ignore
                if (checkbox.checked) l.push(checkbox.getAttribute("value"))
            }
        )
        setChoice(false)
        for (let download_path of l) {
            const config = {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `OAuth ${token}`
                },
                params: {
                    path: download_path
                },
            }
            const url = "https://cloud-api.yandex.net/v1/disk/resources/download"
            try {
                const response = await axios.get<Download>(url, config)
                console.log(response.data.href)
                downloadURI(response.data.href)
            } catch (error) {
                const er = error as AxiosError
                const status = er.response?.status
                console.log(status)
            }
        }
    }

    function alltoogle(){
        const checkboxs: NodeListOf<HTMLElement> = document.querySelectorAll(".form-check-input")
        if (!checkboxs) return
        const allcheck=checkboxs[0]
        // @ts-ignore
        if (allcheck.checked) {
            checkboxs.forEach((checkbox) => {
                // @ts-ignore
                checkbox.checked = true
                }
            )
        }
        else{
            checkboxs.forEach((checkbox) => {
                // @ts-ignore
                checkbox.checked = false
                }
            )
        }
    }

    if (!token) return (<Navigate to="/login"/>)

    if (isError) {
        const er = error as AxiosError
        const status = er.response?.status
        if (!status) return null
        return <div className={"fetch_error"}>Нет доступа к Яндекс диску: {resources_error(status)}</div>
    }


    return (
        <div>
            <Modal show={show} onHide={()=>setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Отправка файлов</Modal.Title>
                </Modal.Header>
                <Modal.Body>Нельзя отправить более 100 файлов!</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        setShow(false)
                        onButtonClick()
                    }}>
                        Отправить снова
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={modal_del} onHide={()=>setModal_del(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Удаление файлов</Modal.Title>
                </Modal.Header>
                <Modal.Body>Вы действительно хотите удалить выделенное?</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => {
                        delete_files()
                    }}>
                        Да
                    </Button>
                    <Button variant="secondary" onClick={() => {
                        setModal_del(false)
                    }}>
                        Нет
                    </Button>
                </Modal.Footer>
            </Modal>
            <button onClick={logout}>выход</button>
            {!choice ? <button onClick={()=>setChoice(true)}>Выбрать</button> : <button onClick={()=>setChoice(false)}>снять выбор</button>}
            {choice && <button onClick={()=>setModal_del(true)}>удалить</button>}
            {choice && <button onClick={download_all}>скачать</button>}
            <div className="table-responsive-lg">
                <table className="table table-dark table-hover">
                    <thead>
                    <tr>
                        {!choice?<th style={{cursor: "pointer", visibility: root ? "hidden" : "visible"}} onClick={() =>
                            setPath(back())} scope="row"><i className="bi bi-box-arrow-left"></i></th>
                        :<th scope="row">
                                <input className="form-check-input" type="checkbox" id="checkboxNoLabel"
                                onClick={alltoogle}/>
                            </th>
                        }
                        <th scope="col" id="col_1">{path}</th>
                        <th scope="col" id="col_2">Дата</th>
                        <th scope="col" id="col_3">Время</th>
                        <th scope="col" id="col_4">Размер</th>
                    </tr>
                    </thead>
                    <tbody>
                    {!isLoading ? data?.map(item =>
                        <tr>

                            {!choice ?
                                item.type === "dir" ? <th scope="row"><i className="bi bi-folder"></i></th>
                                    : <th scope="row"><i className="bi bi-file-earmark"></i></th>
                                : <th scope="row">
                                    <input className="form-check-input" type="checkbox" id="checkboxNoLabel"
                                           value={path !== "/" ? path + "/" + item.name : item.name}
                                    />
                                </th>}
                            {item.type === "dir" ?
                                <td id="col_1" onClick={() => setPath(create_path(item.name))}
                                    style={{cursor: "pointer",}}>{item.name}</td>
                                : <td id="col_1">{item.name}</td>}
                            <td id="col_2"> {get_date(item.modified)}</td>
                            <td id="col_3">{get_time(item.modified)}</td>
                            <td id="col_4">{item.size ? make_size(item.size) : null}</td>
                        </tr>
                    ) : <div className="spinner-border load" role="status">
                    </div>
                    }
                    </tbody>
                </table>
            </div>
            {Files.length > 0 ?
                <div className={"upload_body"}>
                    <div className={"upload_header"}>
                        <i id="CancelAll" className="bi bi-x-lg"></i>
                    </div>
                    <div className={"upload_list"}>
                        {Files.map((file, i) =>
                            <div>
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div className={"fileName"}>{file.file.name}</div>
                                    <i ref={el => cancelRef.current[i] = el} className="bi bi-x-lg"></i>
                                </div>
                                <div className="progress my-3">
                                    <div
                                        ref={el => itemsRef.current[i] = el}
                                        className="progress-bar progress-bar-info" role="progressbar"
                                        style={{backgroundColor: "#59698d"}}
                                    >
                                        <div className="progress-content" style={{backgroundColor: "inherit"}}>
                                            <i style={{height: "10px", width: "10px"}} className="spinner-border">
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
                    <input type='file' id='file' multiple onChange={selectImage} ref={inputFile}
                           style={{display: 'none'}}/>
                    <i className="bi bi-upload"></i>
                </div>

            }
        </div>
    )
};

export default YandexDiskPage;