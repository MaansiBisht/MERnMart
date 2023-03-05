const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");



exports.getProductById = (req, res, next,id) => {
    Product.findById(id).exec((err, product) => {
        if(err) {
            return res.status(400).json({
                error : "Product not found"
            })
        }
        req.product = product;
        next();
    })
}


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, file) =>{
        if(err){
            return res.status(400).jsom({
                return : "problem with image"
            });
        }
        //destructure the fields
        const {name, description, price , category , stock} = fields;

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error : "Please include all the fields"
            })
        }

        //TODO : restrictions on field
        let product =new Product(fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).jso({
                    error: "File size is too big! "
                })
            }
        }
        product.photo.data = fs.readFileSync(file.photo.path)
        product.photo.contenType = file.photo.contenType ;

        //save to the DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error : "Saving tshirt in DB failed"
                })
            }
            res.json(product);
        })
    });
}

exports.getProduct= (req, res) => {
    req.product.photo = undefined;
    return res.json(res.product);
}

exports.photo = (req, res, next) => {
    if(req.product.photo.data){
        res.set("content-Type", req.produc.photo.contentType)
        return res.send(req.product.photo.data);
    }
}

exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove((err, deletedProduct) => {
        if(err){
            return res.status(400).json({
                error: "Failed to delete the product"
            })
        }
        res.json({
            message :" Deletion was the success", deletedProduct
        })
    })

}

exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, file) =>{
        if(err){
            return res.status(400).jsom({
                return : "problem with image"
            });
        }
        //destructure the fields
        const {name, description, price , category , stock} = fields;

    

        //Updation code
        let product = req.product;
        product = _.extend(product, fields)

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).jso({
                    error: "File size is too big! "
                })
            }
        }
        product.photo.data = fs.readFileSync(file.photo.path)
        product.photo.contenType = file.photo.contenType ;

        console.log(product);
        
        //save to the DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error : "Updation of product in DB failed"
                })
            }
            res.json(product);
        })
    });
}

exports.getAllProducts = (req, res) => {
    console.log(req,res)
    // let limit = req.query.limit ? parseInt(req.query.limit) : 8 ;
    // let sortBy = req.query.sortBy ? req. query.sortBy : "_id";
    // Product.find()
    // .limit(limit)
    // .select("-photo")
    // .populate("category")
    // .sort([sortBy, "asc"])
    // .exec((err, products) => {
    //     if(err){
    //         return res.status(400).json({
    //             error :"No product found"
    //         })
    //     }
    // })
}


exports.getAllUniqueCategory = (res, req) => {
    Product.distinct("category", {}, (err, cateogry) => {
        if(err){
            return res.status(400).json({
                error : "NO category found"
            })
        }
        res.json(categories);
    })
}

exports.updateStocks = (req, res, next) => {
    let myOperations = req.body.order.products.map(prod =>{
        return {
            updateOne : {
                filter : { _id: prod_id},
                update : {$inc: { stock : -prod.count , sold : +prod.count}}
                
            }
        }
    })

    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err){
            return res.status(400).json({
                error : "Bulk  operation failed" 
            })
        }
        
    })
    next();
}

