import { IOptions } from "form-dynamic-angular"

// geral
export interface IOptionsIntegration {
    label: string,
    value: string
}

// user
export interface IUser {
    userName: string,
    registration: number,
    name: string,
    email: string,
    title: string,
    id: string
}

export interface IDataUser {
    data: Array<IUser>
}

// approvers 
export interface IAttachments {
    fileName: string,
    id: string,
    contentType: string
}


export interface IApprovers {
    approverId: string,
    approverName: string,
    flowAction: number
    flowActionDescription: string,
    executedAt: string,
    comment: string,
    attachments: Array<IAttachments>
}

// Title
export interface ITitle {
    description: string,
    id: string
}

export interface IDataTitle {
    data: Array<ITitle>
}

//   formCustom
export interface IHierarchy {
    titleId: string,
    titleDescription: string,
    order: number
}

export interface IInput {
    col: string,
    type: "date" | "number" | "select" | "text" | "upload-files" | "text-area" | "multi" | "date-time",
    label: string,
    formControl: string,
    required: boolean,
    options?: Array<IOptions>
}

export interface ISaveCustomForm {
    title: string,
    form: string,
    controlCreatedForm: string,
    id: string
}

export interface IForm {
    title: string,
    description: string,
    form: Array<IInput>,
    controlCreatedForm: any,
    id: string,
    hierarchy: Array<IHierarchy>
}

export interface IDataForm {
    data: Array<IForm>
}

export interface IDataFormById {
    data: IForm
}



// requisition
export interface IRequisitionSave {
    requesterId: string,
    formId: string,
    controlResponse: string,
    approvers: Array<string>
}


export interface IRequisition {
    requesterId: string,
    customFormId: string,
    controlResponse: string,
    customFormSnapshot: any,
    approvers: Array<IApprovers>,
    title: string,
    status: number,
    requester: string,
    customForm: string,
    id: string
    actions: { approve: boolean, reject: boolean, cancel: boolean }

}

export interface IDataRequisition {
    data: Array<IRequisition>
}

export interface IDataRequisitionById {
    data: IRequisition
}

export interface IAproveOrReject {
    approverId: string,
    requisitionId: string,
    id: string,
    requesterId: string,
    comment: string,
    attachments: Array<File>
}

export interface IMyRequisitions {
    data: {
        Aprovado: Array<IRequisition>,
        Cancelado_Rejeitado: Array<IRequisition>,
        Minhas_Aprovacoes: Array<IRequisition>,
        Em_Andamento: Array<IRequisition>
    }
}


export type TTitles = Array<'Aprovado' | 'Cancelado_Rejeitado' | 'Minhas_Aprovacoes' | 'Em_Andamento'>

// Auth
export interface IAuth {
    id: string,
    registration: string,
    username: string,
    name: string,
    email: string,
    token: string
}