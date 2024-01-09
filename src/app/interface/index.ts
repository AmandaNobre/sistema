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
    controlCreatedForm: string
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
export interface IRequisition {
    formId: string,
    controlResponse: string,
    approvers: Array<string>
}