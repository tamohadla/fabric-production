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

// تعبئة قائمة مصانع الدائري
async function loadFactories() {
  const snap = await getDocs(collection(db, "circularFactories"));
  const select = document.getElementById("ye-factory");
  select.innerHTML = '<option value="">اختر مصنع دائري...</option>';
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    const opt = document.createElement("option");
    opt.value = docSnap.id;
    opt.textContent = d.name || "";
    select.appendChild(opt);
  });
}
loadFactories();

// تعبئة قائمة الخيوط لكل سطر
async function loadYarnTypesForRow(select) {
  const snap = await getDocs(collection(db, "yarnTypes"));
  select.innerHTML = '<option value="">اختر نوع الخيط...</option>';
  snap.forEach((docSnap) => {
    const d = docSnap.data();
    const opt = document.createElement("option");
    opt.value = docSnap.id;
    opt.textContent = d.name ? (d.count ? d.name + " - " + d.count : d.name) : docSnap.id;
    select.appendChild(opt);
  });
}

const linesBody = document.getElementById("yarn-lines-body");
const addLineBtn = document.getElementById("add-yarn-line");
const saveBtn = document.getElementById("save-yarn-entry");
const totalKgEl = document.getElementById("total-kg");
const totalCartonsEl = document.getElementById("total-cartons");
const totalValueEl = document.getElementById("total-value");

function recalcTotals() {
  let totalKg = 0;
  let totalCartons = 0;
  let totalValue = 0;
  linesBody.querySelectorAll("tr").forEach((tr) => {
    const kg = parseFloat(tr.querySelector(".line-kg").value || "0");
    const cartons = parseFloat(tr.querySelector(".line-cartons").value || "0");
    const price = parseFloat(tr.querySelector(".line-price").value || "0");
    const value = kg * price;
    tr.querySelector(".line-total").value = value ? value.toFixed(2) : "";
    totalKg += kg;
    totalCartons += cartons;
    totalValue += value;
  });
  totalKgEl.textContent = totalKg.toFixed(2);
  totalCartonsEl.textContent = totalCartons.toFixed(0);
  totalValueEl.textContent = totalValue.toFixed(2);
}

async function addLine() {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><select class="line-yarn"></select></td>
    <td><input type="text" class="line-brand" /></td>
    <td><input type="number" class="line-kg" min="0" step="0.01" /></td>
    <td><input type="number" class="line-cartons" min="0" step="1" /></td>
    <td><input type="number" class="line-price" min="0" step="0.01" /></td>
    <td>
      <select class="line-currency">
        <option value="EGP">EGP</option>
        <option value="USD">USD</option>
      </select>
    </td>
    <td><input type="number" class="line-total" disabled /></td>
    <td><button type="button" class="line-delete">✕</button></td>
  `;
  linesBody.appendChild(tr);

  const select = tr.querySelector(".line-yarn");
  await loadYarnTypesForRow(select);

  tr.querySelectorAll("input, select").forEach((el) => {
    if (el.classList.contains("line-total")) return;
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
  const supplier = document.getElementById("ye-supplier").value.trim();
  const factoryId = document.getElementById("ye-factory").value;
  const date = document.getElementById("ye-date").value;
  const receipt = document.getElementById("ye-receipt").value.trim();
  const status = document.getElementById("ye-status").value;
  const notes = document.getElementById("ye-notes").value.trim();

  if (!supplier || !factoryId || !date || !receipt) {
    alert("من فضلك ادخل بيانات الإذن الأساسية.");
    return;
  }

  const lines = [];
  linesBody.querySelectorAll("tr").forEach((tr) => {
    const yarnId = tr.querySelector(".line-yarn").value;
    const brand = tr.querySelector(".line-brand").value.trim();
    const kg = parseFloat(tr.querySelector(".line-kg").value || "0");
    const cartons = parseFloat(tr.querySelector(".line-cartons").value || "0");
    const price = parseFloat(tr.querySelector(".line-price").value || "0");
    const currency = tr.querySelector(".line-currency").value;
    if (!yarnId || !kg) return;
    lines.push({ yarnId, brand, kg, cartons, price, currency });
  });

  if (!lines.length) {
    alert("أضف على الأقل بند خيط واحد.");
    return;
  }

  const totals = {
    totalKg: parseFloat(totalKgEl.textContent || "0"),
    totalCartons: parseFloat(totalCartonsEl.textContent || "0"),
    totalValue: parseFloat(totalValueEl.textContent || "0")
  };

  await addDoc(collection(db, "yarnEntries"), {
    supplier,
    factoryId,
    date,
    receipt,
    status,
    notes,
    lines,
    totals,
    createdAt: new Date().toISOString()
  });

  alert("تم حفظ الإذن.");
  document.getElementById("yarn-entry-form").reset();
  linesBody.innerHTML = "";
  recalcTotals();
});

// عرض آخر الأذونات
const recentBody = document.getElementById("recent-yarn-entries");
const qRef = query(collection(db, "yarnEntries"), orderBy("date", "desc"));

onSnapshot(qRef, (snap) => {
  recentBody.innerHTML = "";
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
    recentBody.appendChild(tr);
  });
});

addLine(); // سطر واحد افتراضي
