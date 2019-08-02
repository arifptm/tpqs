const {Member, Event, Debt, Saving, Installment, Inout} = require('../models');
// const config = require('../configs/config.js');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;



module.exports = {  
  async member (req,res,next) {
    try{
      const members = [
        {"id": 1, "image": "ardana-wijaya.jpg", "fullname": "Ardana Wijaya", "alias": "Ardana", "address": "PSA 76", "enabled": false, "phone": "081"},
        {"id": 2, "image": "agus-pratama.jpg", "fullname": "Agus Pratama", "alias": "Agus", "address": "", "enabled": true, "last_debt": 3200000,"phone": "081"},
        {"id": 3, "image": "arif-patmainudin.jpg", "fullname": "Arif Patmainudin", "alias": "Arif", "address": "PSA 80", "enabled": true, "phone": "081"},
        {"id": 4, "image": "aritonang.jpg", "fullname": "Aritonang", "alias": "Tonang", "address": "", "enabled": true, "last_debt": 600000,"phone": "081"},
        {"id": 5, "image": "bambang.jpg", "fullname": "Bambang", "alias": "Bambang", "address": "", "enabled": true, "phone": "081"},
        {"id": 6, "image": "beni-prawata.jpg", "fullname": "Beni Prawata", "alias": "Beni", "address": "", "enabled": true, "phone": "081"},
        {"id": 7, "image": "budiyat.jpg", "fullname": "Budiyat", "alias": "Budiyat", "address": "", "enabled": true, "last_debt": 1400000,"phone": "081"},
        {"id": 8, "image": "dedi-widianto.jpg", "fullname": "Dedi Widianto", "alias": "Dedi", "address": "", "enabled": true, "last_debt": 1900000,"phone": "081"},
        {"id": 9, "image": "eko-budi-w.jpg", "fullname": "Eko Budi W", "alias": "Eko BW", "address": "", "enabled": true, "last_debt": 250000,"phone": "081"},
        {"id": 10,  "image": "haryo.jpg", "fullname": "Haryo", "alias": "Haryo", "address": "", "enabled": true, "phone": "081"},
        {"id": 11,  "image": "isnu.jpg", "fullname": "Isnu", "alias": "Isnu", "address": "", "enabled": true, "last_debt": 2700000,"phone": "081"},
        {"id": 12,  "image": "lestari-wiyono.jpg", "fullname": "Lestari Wiyono", "alias": "Lestari", "address": "", "enabled": true, "phone": "081"},
        {"id": 13,  "image": "mutahar.jpg", "fullname": "Mutahar", "alias": "Mutahar", "address": "", "enabled": false, "phone": "081"},
        {"id": 14,  "image": "priyono.jpg", "fullname": "Priyono", "alias": "Priyo", "address": "", "enabled": false, "last_debt": 600000,"phone": "081"},
        {"id": 15,  "image": "rahmat-suryono.jpg", "fullname": "Rahmat Suryono", "alias": "Rahmat", "address": "", "enabled": true, "last_debt": 1800000,"phone": "081"},
        {"id": 16,  "image": "sadtoto.jpg", "fullname": "Sadtoto", "alias": "Totok", "address": "", "enabled": true, "phone": "081"},
        {"id": 17,  "image": "sughoib.jpg", "fullname": "Sughoib", "alias": "Ghoib", "address": "", "enabled": true, "phone": "081"},
        {"id": 18,  "image": "sutomo.jpg", "fullname": "Sutomo", "alias": "Tomo", "address": "", "enabled": true, "last_debt": 400000,"phone": "081"},
        {"id": 19,  "image": "suwardi-p.jpg", "fullname": "Suwardi, P", "alias": "Wardi, Pak", "address": "", "enabled": true, "last_debt": 300000,"phone": "081"},
        {"id": 20,  "image": "suwardi-m.jpg", "fullname": "Suwardi, M", "alias": "Wardi, Mas", "address": "", "enabled": true, "last_debt": 600000,"phone": "081"},
        {"id": 21,  "image": "wisnu-adiyta.jpg", "fullname": "Wisnu Aditya, 90", "alias": "Wisnu No90", "address": "PSA 90", "enabled": true, "last_debt": 400000,"phone": "081"},
        {"id": 22,  "image": "wisnu-wardoyo.jpg", "fullname": "Wisnu Wardoyo (Naya)", "alias": "Wisnu Naya", "address": "", "enabled": true, "last_debt": 300000,"phone": "081"},
        {"id": 23,  "image": "yulianto.jpg", "fullname": "Yulianto", "alias": "Yuli", "address": "", "enabled": false, "last_debt": 1650000,"phone": "081"},
        {"id": 24,  "image": "wawan-kartika.jpg", "fullname": "Wawan Kartika", "alias": "Wawan", "address": "", "enabled": false, "phone": "081"},
        {"id": 25,  "image": "pramono.jpg", "fullname": "Pramono", "alias": "Pramono", "address": "", "enabled": false, "phone": "081"},
        {"id": 26,  "image": "kholik-dimiyati.jpg", "fullname": "Kholik Dimiyati", "alias": "Kholik", "address": "", "enabled": false, "phone": "081"},
        {"id": 27,  "image": "agustinus.jpg", "fullname": "Agustinus", "alias": "Agustinus", "address": "", "enabled": false, "phone": "081"},
        {"id": 28,  "image": "hari.jpg", "fullname": "Hari", "alias": "Hari", "address": "", "enabled": false, "phone": "081"} 
      ]

      const events = [
        { "id": 1, "member_id": 15, "date": "2017-07-21", "debt": 19350000, "saving": 8987000, "installment": 2750000, "other": 700000, "cash": 2875000 }
      ]

      const savings = [
        { "id": 1, "event_id": 1, "member_id": 1, "amount": 225000},
        { "id": 2, "event_id": 1, "member_id": 2, "amount": 63000},
        { "id": 3, "event_id": 1, "member_id": 3, "amount": 190000},
        { "id": 4, "event_id": 1, "member_id": 4, "amount": 250000},
        { "id": 5, "event_id": 1, "member_id": 5, "amount": 400000},
        { "id": 6, "event_id": 1, "member_id": 6, "amount": 1295000},
        { "id": 7, "event_id": 1, "member_id": 7, "amount": 445000},
        { "id": 8, "event_id": 1, "member_id": 8, "amount": 218000},
        { "id": 9, "event_id": 1, "member_id": 9, "amount": 490000},
        { "id": 10, "event_id": 1, "member_id": 10, "amount": 595000},
        { "id": 11, "event_id": 1, "member_id": 11, "amount": 95000},
        { "id": 12, "event_id": 1, "member_id": 12, "amount": 375000},
        { "id": 13, "event_id": 1, "member_id": 13, "amount": 155000},
        { "id": 14, "event_id": 1, "member_id": 14, "amount": 50000},
        { "id": 15, "event_id": 1, "member_id": 15, "amount": 974000},
        { "id": 16, "event_id": 1, "member_id": 16, "amount": 282000},
        { "id": 17, "event_id": 1, "member_id": 17, "amount": 555000},
        { "id": 18, "event_id": 1, "member_id": 18, "amount": 285000},
        { "id": 19, "event_id": 1, "member_id": 19, "amount": 200000},
        { "id": 20, "event_id": 1, "member_id": 20, "amount": 600000},
        { "id": 21, "event_id": 1, "member_id": 21, "amount": 95000},
        { "id": 22, "event_id": 1, "member_id": 22, "amount": 655000},
        { "id": 23, "event_id": 1, "member_id": 23, "amount": 1295000},
        { "id": 24, "event_id": 1, "member_id": 15, "amount": 50000},
        { "id": 25, "event_id": 1, "member_id": 19, "amount": 50000},
        { "id": 26, "event_id": 1, "member_id": 20, "amount": 100000},
        { "id": 27, "event_id": 1, "member_id": 6, "amount": -1000000},
        { "id": 28, "event_id": 1, "member_id": 15, "amount": 90000},
        { "id": 29, "event_id": 1, "member_id": 9, "amount": -250000}
      ]

      const debts = [
        { "id": 1, "event_id": 1, "member_id": 2, "amount": 3200000, "paid": 400000, "paytimes": 8 },
        { "id": 2, "event_id": 1, "member_id": 4, "amount": 600000, "paid": 200000, "paytimes": 3},
        { "id": 3, "event_id": 1, "member_id": 7, "amount": 1400000, "paid": 200000, "paytimes": 7},
        { "id": 4, "event_id": 1, "member_id": 8, "amount": 1900000, "paid": 0, "paytimes": 5},
        { "id": 5, "event_id": 1, "member_id": 9, "amount": 250000, "paid": 250000, "paytimes": 1},
        { "id": 6, "event_id": 1, "member_id": 11, "amount": 2700000, "paid": 0, "paytimes": 9},
        { "id": 7, "event_id": 1, "member_id": 14, "amount": 600000, "paid": 0, "paytimes": 3},
        { "id": 8, "event_id": 1, "member_id": 15, "amount": 1800000, "paid": 300000, "paytimes": 6},
        { "id": 9, "event_id": 1, "member_id": 18, "amount": 400000, "paid": 200000, "paytimes": 2},
        { "id": 10, "event_id": 1, "member_id": 19, "amount": 300000, "paid": 300000, "paytimes": 1},
        { "id": 11, "event_id": 1, "member_id": 20, "amount": 600000, "paid": 200000, "paytimes": 3},
        { "id": 12, "event_id": 1, "member_id": 21, "amount": 400000, "paid": 400000, "paytimes": 1},
        { "id": 13, "event_id": 1, "member_id": 22, "amount": 300000,  "paid": 300000, "paytimes": 1},
        { "id": 14, "event_id": 1, "member_id": 23, "amount": 1650000, "paid": 0, "paytimes": 7},
        { "id": 15, "event_id": 1, "member_id": 19, "amount": 3000000, "paid": 0, "paytimes": 10},
        { "id": 16, "event_id": 1, "member_id": 22, "amount": 3000000, "paid": 0, "paytimes": 10}
      ]

      const installments = [
        { "id": 1, "event_id": 1, "debt_id": 1, "amount": 400000, "billed_on": "2017-07-21" },
        { "id": 2, "event_id": 1, "debt_id": 2, "amount": 200000, "billed_on": "2017-07-21" },
        { "id": 3, "event_id": 1, "debt_id": 3, "amount": 200000, "billed_on": "2017-07-21" },
        { "id": 4, "event_id": null, "debt_id": 4, "amount": 400000, "billed_on": "2017-07-21" },
        { "id": 5, "event_id": 1, "debt_id": 5, "amount": 250000, "billed_on": "2017-07-21"},
        { "id": 6, "event_id": null, "debt_id": 6, "amount": 300000, "billed_on": "2017-07-21" }, 
        { "id": 7, "event_id": null, "debt_id": 7, "amount": 200000, "billed_on": "2017-07-21" }, 
        { "id": 8, "event_id": 1, "debt_id": 8, "amount": 300000, "billed_on": "2017-07-21" },
        { "id": 9, "event_id": 1, "debt_id": 9, "amount": 200000, "billed_on": "2017-07-21" }, 
        { "id": 10, "event_id": 1, "debt_id": 10, "amount": 300000, "billed_on": "2017-07-21" },
        { "id": 11, "event_id": 1, "debt_id": 11, "amount": 200000, "billed_on": "2017-07-21" },
        { "id": 12, "event_id": 1, "debt_id": 12, "amount": 400000, "billed_on": "2017-07-21" },
        { "id": 13, "event_id": 1, "debt_id": 13, "amount": 300000, "billed_on": "2017-07-21" },
        { "id": 14, "event_id": null, "debt_id": 14, "amount": 250000, "billed_on": "2017-07-21" }
      ]

      const inouts = [
        { "id": 1, "event_id": 1, "debt_id": null, "member_id": 11,"amount": 400000, "note": "Kembalian beli sound sistem" },      
        { "id": 2, "event_id": 1, "debt_id": 15, "member_id": 19,"amount": 150000, "note": "Sumbangan RT (Wardi, Pak: 3.000.000)" },      
        { "id": 3, "event_id": 1, "debt_id": 16, "member_id": 22,"amount": 150000, "note": "Sumbangan RT (Wisnu Naya: 3.000.000)" }        
      ]

      await members.forEach(member=>{
        Member.create(member)
      })

      await events.forEach(event=>{
        Event.create(event)
      })

      await savings.forEach(saving=>{
        Saving.create(saving)
      })

      await debts.forEach(debt=>{
        Debt.create(debt)
      })

      await installments.forEach(installment=>{
        Installment.create(installment)
      })

      await inouts.forEach(inout=>{
        Inout.create(inout)
      })

      res.send("suskes")

    } catch (err){
      res.status(500).send({ error: err})
    }
  }
}