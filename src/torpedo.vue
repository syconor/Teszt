<template>
  <head>
    <title>Torpedo</title>
  </head>
  <div id="app">
    <h2>Torpedo</h2>
    <hr>
    <hr>
    <table>
      <tr>
        <td class="nagy" id="tabla1">
          <table class="t1" @click.right.stop.prevent>
            <tr v-for = "(row,b) in table1">
              <td v-for = "(cell,a) in row"
                @click.exact = "lclick(a,b)"
                v-html="cell"></td>
            </tr>
          </table>
        </td>
        <td class="nagy" id="tabla2">
          <table class="t1" @click.right.stop.prevent>
            <tr v-for = "(row,d) in table2">
              <td v-for = "(cell,c) in row"
                @click.exact = "rclick(c,d)"
                v-html="cell"></td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
const client_id=Math.round(Math.random()*1000000)*11
const socket = new WebSocket('ws://localhost:3000',"echo-protocol")
export default {
  name: 'app',
  data() {
    return {

      table1: [],
      table2: [],
      sz1: 0,
      sz2: 0,
      message: '',

        }
  },

  computed: {

  },
  mounted() {
    this.createtable()
    socket.addEventListener( 'message', event =>
        this.chatarea.push(event.data)
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
      },



    lclick(x,y) {
      console.log(x,y)
      if ( this.table1[y][x]==="" ) this.$set(this.table1[y], x, this.sz1++)

      send(this.x,this.y)

    },

    /*rclick(x,y) {
      if ( this.table2[y][x]==="" ) this.$set(this.table2[y], x, this.sz2++)
    },*/
    send(cox,coy) {
        socket.send( JSON.stringify({
            id:     client_id,
            msg:    cox+','+coy
          })
        )
        console.log('elküdött koordináták: '+cox+';'+coy);
        this.message=''
    },
  },
 }

</script>

<style>
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
  color: red;
}
b {
  color: red;
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
</style>
