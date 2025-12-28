export const UserRolesEnums ={
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member"
}
export const AvailableUserRole = Object.values(UserRolesEnums);
// it returns an array of the values of the UserRolesEnums object

export const TaskStatusEnums = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done"
}

export const AvailableTaskStatus = Object.values(TaskStatusEnums);