import { auth, db } from "./firebase-init.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
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

// تبويب بسيط
const tabButtons = document.querySelectorAll(".tab-button");
const tabs = document.querySelectorAll(".tab");

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabs.forEach((t) => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// Yarn types
const ytForm = document.getElementById("yarn-type-form");
const ytTable = document.getElementById("yarn-types-table");

ytForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("yt-name").value.trim(),
    category: document.getElementById("yt-category").value.trim(),
    count: document.getElementById("yt-count").value.trim(),
    wastePercent: parseFloat(document.getElementById("yt-waste").value || "0"),
    notes: document.getElementById("yt-notes").value.trim()
  };
  if (!data.name) return;
  await addDoc(collection(db, "yarnTypes"), data);
  ytForm.reset();
});

function renderYarnTypes() {
  const qRef = query(collection(db, "yarnTypes"), orderBy("name"));
  onSnapshot(qRef, (snap) => {
    ytTable.innerHTML = "";
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.name || ""}</td>
        <td>${d.category || ""}</td>
        <td>${d.count || ""}</td>
        <td>${d.wastePercent || 0}</td>
        <td>${d.notes || ""}</td>
        <td><button data-id="${docSnap.id}">حذف</button></td>
      `;
      tr.querySelector("button").addEventListener("click", async () => {
        if (confirm("حذف هذا الخيط؟")) {
          await deleteDoc(doc(db, "yarnTypes", docSnap.id));
        }
      });
      ytTable.appendChild(tr);
    });
  });
}
renderYarnTypes();

// Fabrics
const fbForm = document.getElementById("fabric-form");
const fbTable = document.getElementById("fabrics-table");

fbForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("fb-name").value.trim(),
    widthInch: parseFloat(document.getElementById("fb-width").value || "0"),
    gauge: document.getElementById("fb-gauge").value.trim(),
    maxWastePercent: parseFloat(document.getElementById("fb-max-waste").value || "0"),
    composition: document.getElementById("fb-composition").value.trim(),
    notes: document.getElementById("fb-notes").value.trim()
  };
  if (!data.name) return;
  await addDoc(collection(db, "fabrics"), data);
  fbForm.reset();
});

function renderFabrics() {
  const qRef = query(collection(db, "fabrics"), orderBy("name"));
  onSnapshot(qRef, (snap) => {
    fbTable.innerHTML = "";
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.name || ""}</td>
        <td>${d.widthInch || ""}</td>
        <td>${d.gauge || ""}</td>
        <td>${d.maxWastePercent || 0}</td>
        <td>${d.composition || ""}</td>
        <td>${d.notes || ""}</td>
        <td><button data-id="${docSnap.id}">حذف</button></td>
      `;
      tr.querySelector("button").addEventListener("click", async () => {
        if (confirm("حذف هذه الخامة؟")) {
          await deleteDoc(doc(db, "fabrics", docSnap.id));
        }
      });
      fbTable.appendChild(tr);
    });
  });
}
renderFabrics();

// Circular factories
const cfForm = document.getElementById("circular-form");
const cfTable = document.getElementById("circular-table");

cfForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("cf-name").value.trim(),
    contact: document.getElementById("cf-contact").value.trim(),
    notes: document.getElementById("cf-notes").value.trim()
  };
  if (!data.name) return;
  await addDoc(collection(db, "circularFactories"), data);
  cfForm.reset();
});

function renderCircularFactories() {
  const qRef = query(collection(db, "circularFactories"), orderBy("name"));
  onSnapshot(qRef, (snap) => {
    cfTable.innerHTML = "";
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.name || ""}</td>
        <td>${d.contact || ""}</td>
        <td>${d.notes || ""}</td>
        <td><button data-id="${docSnap.id}">حذف</button></td>
      `;
      tr.querySelector("button").addEventListener("click", async () => {
        if (confirm("حذف هذا المصنع؟")) {
          await deleteDoc(doc(db, "circularFactories", docSnap.id));
        }
      });
      cfTable.appendChild(tr);
    });
  });
}
renderCircularFactories();

// Dyehouses
const dhForm = document.getElementById("dyehouse-form");
const dhTable = document.getElementById("dyehouses-table");

dhForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = {
    name: document.getElementById("dh-name").value.trim(),
    contact: document.getElementById("dh-contact").value.trim(),
    notes: document.getElementById("dh-notes").value.trim()
  };
  if (!data.name) return;
  await addDoc(collection(db, "dyehouses"), data);
  dhForm.reset();
});

function renderDyehouses() {
  const qRef = query(collection(db, "dyehouses"), orderBy("name"));
  onSnapshot(qRef, (snap) => {
    dhTable.innerHTML = "";
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${d.name || ""}</td>
        <td>${d.contact || ""}</td>
        <td>${d.notes || ""}</td>
        <td><button data-id="${docSnap.id}">حذف</button></td>
      `;
      tr.querySelector("button").addEventListener("click", async () => {
        if (confirm("حذف هذه المصبغة؟")) {
          await deleteDoc(doc(db, "dyehouses", docSnap.id));
        }
      });
      dhTable.appendChild(tr);
    });
  });
}
renderDyehouses();
