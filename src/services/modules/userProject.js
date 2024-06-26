import mappingService from "../http";

export const user={
    async activeProject(){
        return mappingService.put('/user-project/activate-project')
    },
    async deactiveProject(){
        return mappingService.delete('/user-project/deactivate-project')
    },
    async transferOwnership(payload){
        return mappingService.delete('/user-project/transfer-ownership',payload)
    },
    async removeUser(){
        return mappingService.delete('/user-project/remove-user')
    },
    async addUpdateUser(){
        return await mappingService.put('/user-project/add-update-user')
    },
    async updateProjectDetails(){
        return await mappingService.put('/user-project/update-project-details')
    }
    


}