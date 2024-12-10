import { createContext } from "react";

export interface DeleteModalContextType {
    isDeleteModalOpen: boolean;
    openDeleteModal: ({id , title } : {id : string, title : string }) => void;
}
  
export const DeleteModalContext = createContext<DeleteModalContextType>({
    isDeleteModalOpen : false,
    openDeleteModal: () => {}
})