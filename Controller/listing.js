const listing = require('../models/listing')
const wrapAsync = require('../utilit/wrapAsync')
const Booking = require('../models/booking')


module.exports.indexlisting = async (req,res)=>{
    const allcontent = await listing.find({})
    res.render('index',{allcontent})
}

module.exports.showlisting = async (req,res)=>{
    const {id} = req.params
    const findcontent = await listing.findById(id).populate({path :'reviews', populate :{path :"author"}}).populate('owner')
    if(!findcontent){
        req.flash("error", "This listing doesn't exit")
        res.redirect('/homehop')
    }
    // console.log(findcontent)
    res.render('show',{findcontent})
}

module.exports.newlisting = wrapAsync(async(req,res,next)=>{
   
    let url = req.file.path
    let filename = req.file.filename
    console.log(req.file)
    const newlisting = new listing(req.body.listing)
    // console.log(newlisting)
    newlisting.owner = req.user._id
    newlisting.image = {url,filename}


    let saved = await newlisting.save()
    console.log(saved)
    req.flash("success", "New listing Created Successfully")
    res.redirect('/homehop')
})

// module.exports.newlisting = wrapAsync(async (req, res, next) => {
//     const { path: url, filename } = req.file;
//     const newlisting = new listing({
//       ...req.body.listing,
//       image: { url, filename },
//       owner: req.user._id,
//     });
//     await newlisting.save();
//     req.flash("success", "New listing Created Successfully");
//     res.redirect('/homehop');
//   });

module.exports.editlisting = wrapAsync( async(req,res,next)=>{
    try{
        let {id} = req.params
        const findcontent = await listing.findById(id)
        if(!findcontent){
            req.flash("error", "This listing doesn't exit")
            res.redirect('/homehop')
        }

        let original_image = findcontent.image.url
        original_image = original_image.replace('/upload', '/upload/h_300,w_700,e_blur:250')
        res.render('edit',{findcontent, original_image})
    }catch(err){
        next(err)
    }
})

module.exports.updatelisting = wrapAsync(async (req, res) => {
    let{id} = req.params
    let Listing =  await listing.findByIdAndUpdate(id, {...req.body.findcontent} )

   if(typeof req.file !== "undefined"){
    let url = req.file.path
    let filename = req.file.filename
    Listing.image = {url,filename}
    await Listing.save()
   }
   
    req.flash("success", "Lisiting updated Successfully")
    res.redirect(`/homehop/${id}`)
});

module.exports.deletelisting = async(req,res)=>{
    let {id} = req.params
    await listing.findByIdAndDelete(id)
    req.flash("success", "Deleted Successfully")
    res.redirect('/homehop')
}

module.exports.myaccount = async(req,res)=>{
    const allcontent = await listing.find({})
    res.render('myaccount',{allcontent})
}

module.exports.payment =  async (req, res) => {
    try {
        const { checkin, checkout } = req.body;
        const findcontentId = req.params.id;

        // Create new booking
        const newBooking = new Booking({
            user: req.user._id,  // Assuming req.user contains logged-in user
            property: findcontentId,
            checkin,
            checkout
        });

        await newBooking.save();
        req.flash("success", "Booking Successfully")
        res.redirect("/homehop"); 
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).send("Something went wrong!");
    }
}

module.exports.mybooking = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate("property");

        res.render("mybooking", { bookings });

    } catch (error) {
        console.error("Booking error:", error.message, error.stack);
        res.status(500).send("Something went wrong!");
    }
};
