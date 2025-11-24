import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
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

async function loadFactories() {
  const snap = await getDocs(collection(db, "circularFactories"));
  const select = document.getElementById("ge-from-factory");
  select.innerHTML = '<option value="">اختر مصنع دائري...</option>';
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    const opt = document.createElement("option");
    opt.value = docSnap.id;
    opt.textContent = d.name || "";
    select.appendChild(opt);
  });
}

async function loadDyehouses() {
  const snap = await getDocs(collection(db, "dyehouses"));
  const select = document.getElementById("ge-to-dyehouse");
  select.innerHTML = '<option value="">اختر مصبغة...</option>';
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    const opt = document.createElement("option");
    opt.value = docSnap.id;
    opt.textContent = d.name || "";
    select.appendChild(opt);
  });
}

async function loadFabricsForRow(select) {
  const snap = await getDocs(collection(db, "fabrics"));
  select.innerHTML = '<option value="">اختر نوع الخام...</option>';
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    const opt = document.createElement("option");
    opt.value = docSnap.id;
    opt.textContent = d.name || "";
    select.appendChild(opt);
  });
}

loadFactories();
loadDyehouses();

const linesBody = document.getElementById("grey-lines-body");
const addLineBtn = document.getElementById("add-grey-line");
const saveBtn = document.getElementById("save-grey-entry");
const totalKgEl = document.getElementById("g-total-kg");
const totalRollsEl = document.getElementById("g-total-rolls");

function recalcTotals() {
  let totalKg = 0;
  let totalRolls = 0;
  linesBody.querySelectorAll("tr").forEach((tr) => {
    const kg = parseFloat(tr.querySelector(".line-kg").value || "0");
    const rolls = parseFloat(tr.querySelector(".line-rolls").value || "0");
    totalKg += kg;
    totalRolls += rolls;
  });
  totalKgEl.textContent = totalKg.toFixed(2);
  totalRollsEl.textContent = totalRolls.toFixed(0);
}

async function addLine() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><select class="line-fabric"></select></td>
    <td><input type="text" class="line-brand" /></td>
    <td><input type="number" class="line-kg" min="0" step="0.01" /></td>
    <td><input type="number" class="line-rolls" min="0" step="1" /></td>
    <td><input type="text" class="line-notes" /></td>
    <td><button type="button" class="line-delete">✕</button></td>
  `;
  linesBody.appendChild(tr);

  const select = tr.querySelector(".line-fabric");
  await loadFabricsForRow(select);

  tr.querySelectorAll("input").forEach((el) => {
    el.addEventListener("input", recalcTotals);
  });

  tr.querySelector(".line-delete").addEventListener("click", () => {
    tr.remove();
    recalcTotals();
  });
}

addLineBtn.addEventListener("click", () => {
  addLine();
});

saveBtn.addEventListener("click", async () => {
  const fromFactoryId = document.getElementById("ge-from-factory").value;
  const toDyehouseId = document.getElementById("ge-to-dyehouse").value;
  const date = document.getElementById("ge-date").value;
  const receipt = document.getElementById("ge-receipt").value.trim();
  const notes = document.getElementById("ge-notes").value.trim();

  if (!fromFactoryId || !toDyehouseId || !date || !receipt) {
    alert("من فضلك ادخل بيانات الإذن الأساسية.");
    return;
  }

  const lines = [];
  linesBody.querySelectorAll("tr").forEach((tr) => {
    const fabricId = tr.querySelector(".line-fabric").value;
    const brand = tr.querySelector(".line-brand").value.trim();
    const kg = parseFloat(tr.querySelector(".line-kg").value || "0");
    const rolls = parseFloat(tr.querySelector(".line-rolls").value || "0");
    const lineNotes = tr.querySelector(".line-notes").value.trim();
    if (!fabricId || !kg) return;
    lines.push({ fabricId, brand, kg, rolls, notes: lineNotes });
  });

  if (!lines.length) {
    alert("أضف على الأقل بند خام واحد.");
    return;
  }

  const totals = {
    totalKg: parseFloat(totalKgEl.textContent || "0"),
    totalRolls: parseFloat(totalRollsEl.textContent || "0")
  };

  await addDoc(collection(db, "greyEntries"), {
    fromFactoryId,
    toDyehouseId,
    date,
    receipt,
    notes,
    lines,
    totals,
    createdAt: new Date().toISOString()
  });

  alert("تم حفظ إذن الخام.");
  document.getElementById("grey-entry-form").reset();
  linesBody.innerHTML = "";
  recalcTotals();
});

const recentBody = document.getElementById("recent-grey-entries");
const qRef = query(collection(db, "greyEntries"), orderBy("date", "desc"));

onSnapshot(qRef, (snap) => {
  recentBody.innerHTML = "";
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
    recentBody.appendChild(tr);
  });
});

addLine(); // سطر افتراضي
