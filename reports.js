import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  onSnapshot,
  orderBy,
  query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const logoutBtn = document.getElementById("logout-btn");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

const repYarnBody = document.getElementById("rep-yarn-body");
const repGreyBody = document.getElementById("rep-grey-body");

// أذونات الخيط
const yarnQ = query(collection(db, "yarnEntries"), orderBy("date", "desc"));
onSnapshot(yarnQ, (snap) => {
  repYarnBody.innerHTML = "";
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.date || ""}</td>
      <td>${d.receipt || ""}</td>
      <td>${d.supplier || ""}</td>
      <td>${d.factoryId || ""}</td>
      <td>${d.totals?.totalKg?.toFixed ? d.totals.totalKg.toFixed(2) : d.totals?.totalKg || ""}</td>
    `;
    repYarnBody.appendChild(tr);
  });
});

// أذونات الخام
const greyQ = query(collection(db, "greyEntries"), orderBy("date", "desc"));
onSnapshot(greyQ, (snap) => {
  repGreyBody.innerHTML = "";
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${d.date || ""}</td>
      <td>${d.receipt || ""}</td>
      <td>${d.fromFactoryId || ""}</td>
      <td>${d.toDyehouseId || ""}</td>
      <td>${d.totals?.totalKg?.toFixed ? d.totals.totalKg.toFixed(2) : d.totals?.totalKg || ""}</td>
    `;
    repGreyBody.appendChild(tr);
  });
});
