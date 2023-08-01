import React, {FC} from 'react';
// import {Item} from "../types/YandexDiskApi/resources";
//
// interface FileMangerProps{
//     path: string;
//     root: boolean;
//     data: Item[]
// }
//
//
// const FileManger: FC<FileMangerProps> = ({path, root, data}) => {
//
//     function create_path(name:string){
//         if (root) setRoot(false)
//         if (path==="/") return path+name
//         else{
//             return path+"/"+name
//         }
//     }
//
//     function back(){
//         const i=path.lastIndexOf("/")
//         if (i===0) {
//             setRoot(true)
//             return "/"
//         }
//         return path.slice(0, i)
//     }
//
//
//     return (
//         <div>
//             <div >{path}</div>
//             {!root?<div style={{cursor: "pointer"}} onClick={()=>setPath(back())}><i className={"material-icons"}>cloud</i> ..</div>:null}
//             {data.map(item =>
//                 item.type==="dir"?
//                     <div onClick={()=>setPath(create_path(item.name))} key={item.name} style={{cursor: "pointer"}}>
//                         <i className={"material-icons"}>cloud</i> {item.name}</div>
//                     :
//                     <div>
//                         <div key={item.name}>{item.name} </div>
//                     </div>
//             )}
//         </div>
//     );
// };
//
// export default FileManger;