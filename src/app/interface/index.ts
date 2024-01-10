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


//   formCustom
export default interface ISaveCustomForm {
    title: string,
    form: string,
    controlCreatedForm: string,
    id: string
}

export interface IForm {
    title: string,
    description: string,
    form: string,
    controlCreatedForm: string,
    id: string
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
    customFormSnapshot: string,
    approvers: Array<string>,
    status: number,
    requester: string,
    customForm: string,
    id: string

}

export interface IDataRequisition {
    data: Array<IRequisition>
}

export interface IDataRequisitionById {
    data: IRequisition
}

export interface IAproveOrReject{
    approverId: string,
    requisitionId: string,
    id: string 
}