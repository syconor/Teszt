<template>

 <div id="app">
   <div>
       <h1>Hajók</h1>
       <div>
         <b-form-group >
           <b-form-radio-group id="radio" v-model="select" name="radioSubComponent">
             <b-form-radio value="allo">Álló</b-form-radio>
             <b-form-radio value="fekvo">Fekvő</b-form-radio>

           </b-form-radio-group>
         </b-form-group>


  </div>
   </div>
    <hr>
    <hr>
    <table id="table">
      <th>Saját tábla</th>
      <th></th>
      <th>Ellenfél tábla</th>
      <tr>
        <td class="nagy" id="tabla1">
          <table class="t1" @click.right.stop.prevent>
            <tr v-for = "(row,b) in table1">
              <td id="cella1" v-for = "(cell,a) in row"
                @click.exact = "tclick1(a,b,)"
                v-html="cell"></td>
            </tr>
          </table>
        </td>
        <div class="col" id="felirat"><h1 style="color:blue">Torpedó</h1></div>
        <td class="nagy" id="tabla2">
          <table class="t1" @click.right.stop.prevent>
            <tr v-for = "(row,d) in table2">
              <td id="cella2" v-for = "(cell,c) in row"
                @click = "tclick2(c,d,)"
                v-html="cell"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    <hr>
    <hr>
    <b-btn id="indgomb" @click="indul(sz1)">Játék indítása</b-btn>
    <b-btn id="rs" @click="rs()">Szerver restart</b-btn>
    <hr>
    <hr>
    <h1 id="mezo">{{mezo}}</h1>
    <h1 id="mezo2">{{mezo2}}</h1>
  </div>
</template>

<script>
const client_id=12345678 //Math.round(Math.random()*1000000)*11
const socket = new WebSocket('ws://localhost:3000',"echo-protocol")
export default {
  name: 'app',
  data() {
    return {
      select: 'allo',
      table1: [],
      table2: [],
      ellentable: [],
      et: [],
      sz1: 0,
      sz2: 1,
      message: '',
      adat: [],
      xy: [],
      azon: [],
      hajok: new Set(),
      inds: false,
      inde: false,
      cont: 0,
      mezo: "Indul a támadás. Helyezd el a hajókat!",
      mezo2:"Torpedó made by Jack!",
      id: 0,
    }
  },

  computed: {

  },

  mounted() {
    this.createtable()
    socket.addEventListener( 'message', event => {
        this.adat.push(event.data.split(':'))
        this.azon.push(this.adat[0][0].split(','))
        this.id=Number(this.azon[0])
        this.xy.push(this.adat[0][1].split(';'))
        this.x=Number(this.xy[0][0])
        this.y=Number(this.xy[0][1])
        console.log("Érkezett:"+this.id,this.x,this.y);
        if (this.id==87654321) {
            if (this.x==50 && this.y==50) {
              this.mezo="Te kezdesz."
              this.mezo2="Torpedó made by Jack!"
              this.inds= true
              this.inde = true
            }
            else if (this.x==51 && this.y==51) {
              this.mezo="Az ellenfél kezd."
              this.inds= false
              this.inde = true
            }
            else if  (this.x==20 && this.y==20) {
                alert ("Vége a játéknak! Az ellenfél győzött!\nAz ok-ra kattintva új játék indul.")
                location.reload()
            }
            else if  (this.x==25 && this.y==25) {
                  this.et.push(this.xy[0][2].split(','))
                  for (let i=0;i<10;i++){
                      for (let j=0;j<10;j++){
                        let w=((i*10)+j)
                        this.ellentable[j][i]=this.et[0][w]
                        }
                  }
                  this.mezo = "Az ellenfél elhelyzte a hajóit!"

            }
            else if (this.x<11 && this.y<11) {
                     this.eclick(this.x,this.y)
            }
            else if (this.x==30 && this.y==30) {
                    alert ("A szerver újraindult!")
                    location.reload()
            }
            else {
              alert ("Hibás koordináták érkeztek!")
            }
            console.log(this.inds,this.inde);
        }
        this.azon=[]
        this.id=0
        this.adat=[]
        this.xy=[]}
    )
  },

  methods: {
    createtable() {
      let a, b = 10
      this.table1=[]
      for (let i=0;i<10;i++) {
          let sor = []
          for (let j=0;j<10;j++) sor.push(' ')
          this.table1.push(sor)
      }
      let c, d = 10
          this.table2=[]
          for (let i=0;i<10;i++) {
              let sor = []
              for (let j=0;j<10;j++) sor.push(' ')
              this.table2.push(sor)
          }

          this.ellentable=[]
          for (let i=0;i<10;i++) {
              let sor = []
              for (let j=0;j<10;j++) sor.push(' ')
              this.ellentable.push(sor)
          }
      },

    /*  for (let i=0;i<this.asz;i++) {
          do {
            x = Math.trunc(Math.random()*this.n)
            y = Math.trunc(Math.random()*this.m)
          } while ( this.aknak.has(`${y}-${x}`) )
          this.aknak.add(`${y}-${x}`) */

    tclick1(x,y) {

      if (this.sz1==20) {
          this.mezo = "Nem tudsz több hajót elhelyezni."
          this.mezo2 = " Kattints a Játék indításra!"
      }
      else  {
          if ( this.table1[y][x]==" " && this.inds==false ) {
                  this.$set(this.table1[y], x, 'M')
                  this.sz1++
          }
          else if ( this.table1[y][x]=='M' && this.inds==false ) {
                  this.$set(this.table1[y], x, ' ')
                  this.sz1--
          }
          else {
            this.mezo="A saját tábládra nem lőhetsz!"
            this.mezo2="Kattint a másik táblára!"
          }
          if (this.sz1==20) {
                  this.mezo="Hajók elhelyezve."
                  this.mezo2="Kezdéshez kattints a játék indítására!"
          }
      }

    },

    tclick2(x,y) {
      if (this.inds==true && this.inde==true) {
        if ( this.table2[y][x]!==" " ){
          this.mezo="Ebbe a mezőbe már lőttél!"
          this.mezo2="Válassz másikat!"
        }
        else {
            if ( this.ellentable[x][y]==" " )
              {
                this.$set(this.table2[y], x, 'Ü')
                this.mezo="Nem talált"
                this.mezo2="Az ellenfél következik."
              }
            if ( this.ellentable[x][y]=="M" ) {
                this.$set(this.table2[y], x, 'T')
                this.mezo="Talált"
                this.mezo2="Az ellenfél következik."
                this.cont++
            }
            this.send(x,y)
            if (this.cont==20) {
                this.send(20,20)
                this.send(30,30)
                alert("Gratulálok nyertél\naz ok-ra kattintva új játék indul!")
                location.reload()
            }
        }
      }
      if (this.inds==false && this.inde==false) {
        this.mezo="Először helyezd el a hajókat a saját tábládon!"
        this.mezo2="Torpedó made by Jack!"
      }
      else {
        this.mezo="Ez még nem a Te köröd, kérlek várj!"
        this.mezo2="Torpedó made by Jack!"
      }
    },

    eclick(x,y) {
        this.inds=true

        if ( this.table1[y][x]==" " ) {
            document.getElementById("cella1").style.color = "orange"
            this.$set(this.table1[y], x, 'Ü')
            this.mezo="Az ellenfél lövése nem talált."
            this.mezo2="Te következel."
          }
        if ( this.table1[y][x]=="M" ) {
            document.getElementById("cella1").style.color = "Red"
            this.$set(this.table1[y], x, 'X')
            this.mezo="Az ellenfél lövése talált."
            this.mezo2="Te következel."
        }
      },


    send(cox,coy) {
        socket.send( JSON.stringify({
            id:     client_id,
            msg: cox+';'+coy
          })
        )
        this.inds=false
        console.log("Elküldve: "+cox,coy)
        this.message=''
    },

    sendtabla(cox,coy,tabla) {
        socket.send( JSON.stringify({
            id:     client_id,
            msg: cox+';'+coy+';'+tabla
          })
        )
        console.log("Elküldve: "+cox,coy,)
        this.inds=true
        document.getElementById("indgomb").style.display = "none"
        this.message=''
    },

    indul(e){
      if (e==20) {

          this.mezo2= "Várokozás az ellenfélre."
          this.sendtabla(25,25,this.table1)

      }
      else { this.mezo ="Még nem helyeztél el elég hajót!" }
    },
    rs(){
      this.send(30,30)
    },
  },
  watch: {
    select: function(){
                if (this.select=='allo') {
                  alert('Álló')
                }
                else {alert('Fekvő')}
            }
  }
 }

</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Poppins:500&subset=latin-ext');
html {
  font-family: 'Poppins', sans-serif;
}
.cx {
  margin-left:10px;
  margin-right: 20px;
}
#app {
  margin: 10px;
  text-align: center;
}

#tabla1 {
  color: blue;
}
#tabla2 {
  color: cyan;
}
#mezo {
  color: green;
}
#mezo2 {
  color: LimeGreen;
}

#felirat {
    margin: 10px;
}
#radio{
  text-align: left;
}

td {
  width:30px;
  height:30px;
  box-shadow: 1px 1px 4px #000;
  border-radius: 4px;
  text-align:center;
  cursor:pointer;
  background-color: #effafc;

}
td.nagy {
  width:50% ;
}
.t1 {
   margin: 0 auto;
   border-spacing: 5px;
   border-collapse: separate;
}
th {
  font-size: 30px;
  color: LightSeaGreen;
}
  
</style>
