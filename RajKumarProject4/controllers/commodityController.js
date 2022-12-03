const model = require('../models/commodity');
const modelUser = require('../models/user');
const { DateTime } = require("luxon");

exports.index = (req, res) => {
    let categories = [];
    model.distinct("category", function(error, results){
        categories = results;
    });
    model.find()
    .then(commodities => res.render('./commodities/index', {commodities, categories}))
    .catch(err=>next(err));
};

exports.new = (req, res) => {
    res.render('./commodities/new');
};

exports.create = (req, res,next) => {

    let commodity = new model(req.body);
    commodity.seller = req.session.user;
    commodity.sellerName = req.session.firstName+" "+req.session.lastName;
    commodity.save()
    .then(commodity=> {
        req.flash('success', 'You have successfully created a new commodity');
        res.redirect('/commodities');
    })
    .catch(err=>{
        if(err.name === 'ValidationError' ) {
            err.status = 400;
        }
        next(err);
    });
};

exports.show = (req, res, next) => {
    let id = req.params.id;
    // if(!id.match(/^[0-9a-fA-F]{24}$/)) {
    //     let err = new Error('Invalid commodity id');
    //     err.status = 400;
    //     return next(err);
    // }

    // Promise.all([model.findById(id), Commodity.find({seller: id})]) 
    // .then(results=>{
        
    //     const [user, commodities] = results;
    //     console.log(user);
    //     console.log(commodities);
    //     res.render('./user/profile', {user, commodities});
    // })
    // .catch(err=>next(err));

   
    
    model.findById(id)
    .then(commodity=>{
        if(commodity){
            commodity.date = DateTime.fromSQL(commodity.date).toFormat('LLLL dd, yyyy');
            commodity.startTime = DateTime.fromSQL(commodity.startTime).toFormat('hh:mm a');
            commodity.endTime = DateTime.fromSQL(commodity.endTime).toFormat('hh:mm a');
            // console.log(JSON.stringify(req.session.user));
            let b = false;
            if(req.session.user && req.session.user==commodity.seller) {
                b = true;
            }
            res.render('./commodities/show',{commodity,b});
        }else{
            let err = new Error('Commodity with id '+id+' does not exists');
            err.status = 404;
            next(err);
        }
    }).catch(err=>next(err));
    
};

exports.edit = (req, res, next) => {
    let id = req.params.id;
    model.findById(id).then(commodity=>{
        if(commodity){
            if(commodity.seller==req.session.user){
                res.render('./commodities/edit',{commodity});
            }else{
                let err = new Error('You are not Authorised to edit this commodity');
                err.status = 401;
                next(err);
            }
        }else{
            let err = new Error('Commodity with id '+id+' does not exists');
            err.status = 404;
            next(err);
        }
    }).catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let id = req.params.id;
    let commodity = req.body;
    model.findByIdAndUpdate(id, commodity, {useFindAndModify: false, runValidators: true})
    .then(commodity=>{
        if(commodity) {

            res.redirect('/commodities/'+id);
        } else {
            let err = new Error('Commodity with id '+id+' does not exists');
            err.status = 404;
            next(err);
        }
    })
    .catch(err=> {
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err);
    });
    
};

exports.delete = (req, res, next) => {
    let id = req.params.id;
    let commodity;
    model.findById(id)
    .then(com=>{
        commodity = com;
        if(com.seller!=req.session.user){
            let err = new Error('You are not Authorised to edit this commodity');
                err.status = 401;
                next(err);
        }
    }).catch(err=>next(err)).then(com=>{
        if(commodity.seller==req.session.user){
            model.findByIdAndDelete(id, {useFindAndModify: false})
            .then(commodity =>{
                if(commodity) {
                    res.redirect('/commodities');
                }else{
                    let err = new Error('Commodity with id '+id+' does not exists');
                    err.status = 404;
                    next(err);
                } 
            })
            .catch(err=>next(err));
        }
    });
    
};