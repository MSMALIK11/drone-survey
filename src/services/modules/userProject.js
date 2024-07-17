import mappingService from "../http";

export const user={
    async activeProject(){
        return mappingService.put('/user-project/activate-project')
    },
    async deactiveProject(){
        return mappingService.delete('/user-project/deactivate-project')
    },
    async transferOwnership(payload){
        return mappingService.post('user-project/transfer-ownership',payload)
    },
    async removeUser(delUsersList){

        return mappingService.delete('/user-project/remove-user',{data:delUsersList})
    },
    async addUpdateUser(payload){
        return await mappingService.post('/user-project/add-update-user',payload)
    },
    async updateProjectDetails(){
        return await mappingService.put('/user-project/update-project-details')
    },
    async getListOfUsers(payload){
        return await mappingService.post('/user-project/list-project-users',payload)
    }
    


}