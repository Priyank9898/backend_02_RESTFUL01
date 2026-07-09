class ApiResponse {
  static ok(res, { message = "success", data = null } = {}) {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  }

  static created(res, { message = "created", data = null } = {}) {
    return res.status(201).json({
      success: true,
      message,
      data,
    });
  }

  static noContent(res) {
    return res.status(204).send();
  }
}

export default ApiResponse;
