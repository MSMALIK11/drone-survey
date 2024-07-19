import { mappingService } from "../http"

export const dashboardApi={
    async getallCategory(){
        return  await mappingService.get('/project/categories')
    },
    async addProject(formData){
        return  await mappingService.post('/project/add-project',formData)
    },
    async updateProjectDetails(data){
        return  await mappingService.post('/user-project/update-project-details',data)
    },
    async getAllProjectstList(){
        return  await mappingService.get('/project/my-projects')
    },
    async getProjectDetailsById(projectId){
        return  await mappingService.get(`/project/get-project-by-project-id/${projectId}`)
    },
    async getUserProfile(){
        return  await mappingService.get('/user/me')
    }
}