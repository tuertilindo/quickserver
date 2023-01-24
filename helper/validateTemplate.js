module.exports = (template, request) => {
    if (request.method == "GET") {
        if (request.params.id && template.onGet) {
            return template.onGet(request)
        } else if (template.onGetAll) {
            return template.onGetAll(request)
        }
    }
    if (request.method == "POST" && template.onCreate) {
        return template.onCreate(request)
    }
    if (request.method == "PUT" && template.onEdit) {
        return template.onEdit(request)
    }
    if (request.method == "DELETE" && template.onDelete) {
        return template.onDelete(request)
    }
    return request
}