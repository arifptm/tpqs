const {Member, Event, Debt, Saving} = require('../models');
// const config = require('../configs/config.js');
// const Sequelize = require('sequelize');
// const Op = Sequelize.Op;



module.exports = {  
  async member (req,res,next) {
    try{
      const members = [
        {"id": 1, "image": "ardana-wijaya.jpg", "fullname": "Ardana Wijaya", "alias": "ardana", "slug": "ardana-wijaya", "address": "PSA 76", "enabled": false, "last_debt": 0,"phone": "081"},
        {"id": 2, "image": "agus-pratama.jpg", "fullname": "Agus Pratama", "alias": "agus", "slug": "agus-pratama", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 3, "image": "arif-patmainudin.jpg", "fullname": "Arif Patmainudin", "alias": "arif", "slug": "arif-patmainudin", "address": "PSA 80", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 4, "image": "aritonang.jpg", "fullname": "Aritonang", "alias": "tonang", "slug": "aritonang", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 5, "image": "bambang.jpg", "fullname": "Bambang", "alias": "bambang", "slug": "bambang", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 6, "image": "beni-prawata.jpg", "fullname": "Beni Prawata", "alias": "beni", "slug": "beni-prawoto", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 7, "image": "budiyat.jpg", "fullname": "Budiyat", "alias": "budiyat", "slug": "budiyat", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 8, "image": "dedi-widianto.jpg", "fullname": "Dedi Widianto", "alias": "dedi", "slug": "dedi-widianto", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 9, "image": "eko-budi-w.jpg", "fullname": "Eko Budi W", "alias": "eko", "slug": "eko-budi-w", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 10,  "image": "haryo.jpg", "fullname": "Haryo", "alias": "haryo", "slug": "haryo", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 11,  "image": "isnu.jpg", "fullname": "Isnu", "alias": "isnu", "slug": "isnu", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 12,  "image": "lestari-wiyono.jpg", "fullname": "Lestari Wiyono", "alias": "lestari", "slug": "lestari-wiyono", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 13,  "image": "mutahar.jpg", "fullname": "Mutahar", "alias": "mutahar", "slug": "mutahar", "address": "", "enabled": false, "last_debt": 0,"phone": "081"},
        {"id": 14,  "image": "priyono.jpg", "fullname": "Priyono", "alias": "priyo", "slug": "priyono", "address": "", "enabled": false, "last_debt": 0,"phone": "081"},
        {"id": 15,  "image": "rahmat-suryono.jpg", "fullname": "Rahmat Suryono", "alias": "rahmat", "slug": "rahmat-suryono", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 16,  "image": "sadtoto.jpg", "fullname": "Sadtoto", "alias": "toto", "slug": "sadtoto", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 17,  "image": "sughoib.jpg", "fullname": "Sughoib", "alias": "ghoib", "slug": "sughoib", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 18,  "image": "sutomo.jpg", "fullname": "Sutomo", "alias": "tomo", "slug": "sutomo", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 19,  "image": "suwardi-p.jpg", "fullname": "Suwardi, P", "alias": "wardi", "slug": "suwardi-p", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 20,  "image": "suwardi-m.jpg", "fullname": "Suwardi, M", "alias": "wardi", "slug": "suwardi-p", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 21,  "image": "wisnu-adiyta.jpg", "fullname": "Wisnu Aditya, 90", "alias": "wisnu", "slug": "wisnu-aditya", "address": "PSA 90", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 22,  "image": "wisnu-wardoyo.jpg", "fullname": "Wisnu Wardoyo (Naya)", "alias": "wisnu", "slug": "wisnu-wardoyo", "address": "", "enabled": true, "last_debt": 0,"phone": "081"},
        {"id": 23,  "image": "yulianto.jpg", "fullname": "Yulianto", "alias": "yuli", "slug": "yulianto", "address": "", "enabled": false, "last_debt": 0,"phone": "081"},
        {"id": 24,  "image": "wawan-kartika.jpg", "fullname": "Wawan Kartika", "alias": "wawan", "slug": "wawan-kartika", "address": "", "enabled": false, "last_debt": 0,"phone": "081"},
        {"id": 25,  "image": "pramono.jpg", "fullname": "Pramono", "alias": "pramono", "slug": "pramono", "address": "", "enabled": false, "last_debt": 0,"phone": "081"},
        {"id": 23,  "image": "kholik-dimiyati.jpg", "fullname": "Kholik Dimiyati", "alias": "kholik", "slug": "kholik-dimiyati", "address": "", "enabled": false, "last_debt": 0,"phone": "081"},
        {"id": 23,  "image": "agustinus.jpg", "fullname": "Agustinus", "alias": "agustinus", "slug": "agustinus", "address": "", "enabled": false, "last_debt": 0,"phone": "081"},
        {"id": 23,  "image": "hari.jpg", "fullname": "Hari", "alias": "hari", "slug": "Hari", "address": "", "enabled": false, "last_debt": 0,"phone": "081"} 
      ]

      const events = [
        { "id": 1, "member_id": 15, "date": "2017-07-21"}
      ]

      const debts = [
        { "id": 1, "event_id": 1, "member_id": 2, "amount": 3200000, "paytimes": 8 },
        { "id": 1, "event_id": 1, "member_id": 4, "amount": 600000, "paytimes": 3},
        { "id": 1, "event_id": 1, "member_id": 7, "amount": 1400000, "paytimes": 7},
        { "id": 1, "event_id": 1, "member_id": 8, "amount": 1900000, "paytimes": 0000},
        { "id": 1, "event_id": 1, "member_id": 9, "amount": 250000, "paytimes": 1},
        { "id": 1, "event_id": 1, "member_id": 11, "amount": 2700000, "paytimes": 9},
        { "id": 1, "event_id": 1, "member_id": 14, "amount": 600000, "paytimes": 0000},
        { "id": 1, "event_id": 1, "member_id": 15, "amount": 1800000, "paytimes": 6},
        { "id": 1, "event_id": 1, "member_id": 18, "amount": 400000, "paytimes": 2},
        { "id": 1, "event_id": 1, "member_id": 19, "amount": 300000, "paytimes": 1},
        { "id": 1, "event_id": 1, "member_id": 20, "amount": 600000, "paytimes": 3},
        { "id": 1, "event_id": 1, "member_id": 21, "amount": 400000, "paytimes": 1},
        { "id": 1, "event_id": 1, "member_id": 22, "amount": 300000, "paytimes": 1},
        { "id": 1, "event_id": 1, "member_id": 23, "amount": 1650000, "paytimes": 000}
      ]

      const savings = [
        { "id": 1, "event_id": 1, "member_id": 15, "amount": 50000}
      ]


      await members.forEach(member=>{
        Member.create(member)
      })

      await events.forEach(event=>{
        Event.create(event)
      })

      await debts.forEach(debt=>{
        Debt.create(debt)
      })

      await savings.forEach(saving=>{
        Saving.create(saving)
      })

      res.send("suskes")

    } catch (err){
      res.status(500).send({ error: err})
    }
  }
}