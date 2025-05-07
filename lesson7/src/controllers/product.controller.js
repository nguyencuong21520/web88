
const productController = {
  getProducts: async (req, res) => {
    res.status(200).json({
      message: "get products successfully",
    });
  },
};

export default productController;