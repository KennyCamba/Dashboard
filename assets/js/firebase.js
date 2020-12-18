const database = firebase.database();
let donaciones;
let users;
let institutions;


loadData();
function loadData() {
    database.ref('/DONACIONES/').orderByChild("createdAt").once('value').then((snapshot) => {
        donaciones = snapshot.val();
        document.getElementById("donates").innerHTML = Object.keys(donaciones).length;
        loadTable(donaciones);
        loadPercents();
    });
    database.ref('/USERS/').once('value').then((snapshot) => {
        users = snapshot.val();
        document.getElementById("users").innerHTML = Object.keys(users).length;

    });
    database.ref('/INSTITUCIONES/').once('value').then((snapshot) => {
        institutions = snapshot.val();
        document.getElementById("inst").innerHTML = institutions.length;
    });
    database.ref('/DONACIONES/').orderByChild("createdAt").on('value', (snapshot) => {
        donaciones = snapshot.val();
        document.getElementById("donates").innerHTML = Object.keys(donaciones).length;
        loadTable(donaciones);
        loadPercents();
    });
    database.ref('/USERS/').on('value', (snapshot) => {
        users = snapshot.val();
        document.getElementById("users").innerHTML = Object.keys(users).length;

    });
    database.ref('/INSTITUCIONES/').on('value', (snapshot) => {
        institutions = snapshot.val();
        document.getElementById("inst").innerHTML = institutions.length;
    });
}

function loadTable(data) {
    const table = document.getElementById("table");
    table.innerHTML = "";
    for (let dat in data) {
        let donacion = donaciones[dat];
        let tr = document.createElement("tr");
        tr.innerHTML = `
        <th scope="row">
          ${formatDateTime(donacion["createdAt"])}
      </th>
      <td>
      ${donacion["institucion"]["INSTITUCION"]}
      </td>
      <td>
      ${donacion["user"]["email"]}
      </td>
      <td>
      ${donacion["estado"]}
      </td>           
        `;
        table.insertBefore(tr, table.firstChild);
    }

}

function loadPercents() {
    let pro = 0, pre = 0, per = 0;
    let global = 0;
    for (let don in donaciones) {
        let donacion = donaciones[don];
        let alim = donacion["alimentos"];
        global += alim.length;
        for (let i = 0; i < alim.length; i++) {
            if (alim[i]["tipoAlimento"] == "Procesados o al Granel") {
                pro++;
            } else if (alim[i]["tipoAlimento"] == "Preparados") {
                pre++;
            } else if (alim[i]["tipoAlimento"] == "Perecederos") {
                per++;
            }
        }
    }
    let spro = (pro/global*100).toFixed(0) + "%";
    let spre = (pre/global*100).toFixed(0) + "%";
    let sper = (per/global*100).toFixed(0) + "%";
    document.getElementById("cpro").innerHTML = pro;
    document.getElementById("ppro").innerHTML = spro;
    document.getElementById("vpro").style = "width: " + spro;
    document.getElementById("cpre").innerHTML = pre;
    document.getElementById("ppre").innerHTML = spre;
    document.getElementById("vpre").style = "width: " + spre;
    document.getElementById("cper").innerHTML = per;
    document.getElementById("pper").innerHTML = sper;
    document.getElementById("vper").style = "width: " + sper;
}

function formatDateTime(datetime) {
    let m = new Date(datetime);
    return m.getUTCFullYear() + "/" +
        ("0" + (m.getUTCMonth() + 1)).slice(-2) + "/" +
        ("0" + m.getUTCDate()).slice(-2) + " " +
        ("0" + m.getUTCHours()).slice(-2) + ":" +
        ("0" + m.getUTCMinutes()).slice(-2) + ":" +
        ("0" + m.getUTCSeconds()).slice(-2);
}