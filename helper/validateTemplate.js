module.exports = async (template, request) => {
    if (request.method == "GET") {
        if (request.params.id && template.onGet) {
            return await template.onGet(request)
        } else if (template.onGetAll) {
            return await template.onGetAll(request)
        }
    }
    if (request.method == "POST" && template.onCreate) {
        return await template.onCreate(request)
    }
    if (request.method == "PUT" && template.onEdit) {
        return await template.onEdit(request)
    }
    if (request.method == "DELETE" && template.onDelete) {
        return await template.onDelete(request)
    }
    return request
}