import { drizzle } from "drizzle-orm/mysql2";
import { contratos, pagamentos, propriedades } from "../drizzle/schema";

const db = drizzle(process.env.DATABASE_URL!);

const MESES_2025 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

type StatusPag = "pago" | "caucao" | "pendente" | "atrasado";

interface InquilinoSeed {
  casa: string;
  nomeInquilino: string;
  dataEntrada: string | null;
  dataSaida: string | null;
  caucao: number;
  aluguel: number;
  diaPagamento: number | null;
  status: "ativo" | "encerrado" | "pendente";
  pagamentos2025: (StatusPag | null)[];
  pag_jan2026: StatusPag | null;
  pag_fev2026: StatusPag | null;
}

const prop1Inquilinos: InquilinoSeed[] = [
  {
    casa: "205", nomeInquilino: "Maria Neci", dataEntrada: "2023-05-15", dataSaida: "2025-12-06",
    caucao: 500, aluguel: 479, diaPagamento: 30, status: "encerrado",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "204", nomeInquilino: "Francisca Pacífico", dataEntrada: "2025-07-21", dataSaida: "2028-07-21",
    caucao: 500, aluguel: 450, diaPagamento: 5, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "211", nomeInquilino: "Adones de Oliveira Silva", dataEntrada: "2025-07-21", dataSaida: "2028-07-21",
    caucao: 500, aluguel: 450, diaPagamento: 15, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "216", nomeInquilino: "Antônio José Rodrigues Farias", dataEntrada: "2024-08-12", dataSaida: "2025-08-12",
    caucao: 500, aluguel: 450, diaPagamento: 10, status: "encerrado",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "193", nomeInquilino: "Cristiane", dataEntrada: "2024-11-22", dataSaida: "2028-11-22",
    caucao: 450, aluguel: 450, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "198", nomeInquilino: "Rayron Oliveira", dataEntrada: "2025-01-09", dataSaida: "2028-01-09",
    caucao: 500, aluguel: 450, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["caucao","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "217", nomeInquilino: "Felipe dos Santos Justino", dataEntrada: "2025-04-12", dataSaida: "2028-09-23",
    caucao: 500, aluguel: 500, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,null,null,"caucao","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "199", nomeInquilino: "Elisangela Silva", dataEntrada: "2025-09-23", dataSaida: "2028-09-23",
    caucao: 1000, aluguel: 450, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,"caucao","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "192", nomeInquilino: "Barbara", dataEntrada: "2025-11-27", dataSaida: "2028-11-27",
    caucao: 450, aluguel: 450, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,null,null,"caucao","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "210", nomeInquilino: "Wanderson", dataEntrada: "2025-11-17", dataSaida: "2028-11-17",
    caucao: 933, aluguel: 450, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,null,null,"caucao","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
];

const prop2Inquilinos: InquilinoSeed[] = [
  {
    casa: "145", nomeInquilino: "Francisco Etiano G Cunha", dataEntrada: "2025-07-21", dataSaida: "2028-07-21",
    caucao: 500, aluguel: 532, diaPagamento: 16, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "133", nomeInquilino: "Ana Alice Miranda Ciriaco", dataEntrada: "2025-07-21", dataSaida: "2028-07-21",
    caucao: 550, aluguel: 532, diaPagamento: 24, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "127", nomeInquilino: "Elias Miranda", dataEntrada: "2025-07-21", dataSaida: "2028-07-21",
    caucao: 600, aluguel: 532, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "139", nomeInquilino: "José Claudeci", dataEntrada: "2025-02-18", dataSaida: "2028-02-18",
    caucao: 550, aluguel: 550, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["caucao","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "121", nomeInquilino: "Emily", dataEntrada: "2025-11-19", dataSaida: "2028-11-19",
    caucao: 550, aluguel: 550, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,null,null,"caucao","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
];

const prop3Inquilinos: InquilinoSeed[] = [
  {
    casa: "214", nomeInquilino: "Rocilda Martins Rocha", dataEntrada: "2021-08-11", dataSaida: "2025-01-11",
    caucao: 600, aluguel: 532, diaPagamento: 11, status: "encerrado",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "208", nomeInquilino: "Angélica Soares do Nascimento", dataEntrada: "2023-08-07", dataSaida: "2025-08-07",
    caucao: 600, aluguel: 532, diaPagamento: 15, status: "encerrado",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "202", nomeInquilino: "Gessica Santos Silva", dataEntrada: "2023-10-23", dataSaida: "2025-10-23",
    caucao: 600, aluguel: 532, diaPagamento: 10, status: "encerrado",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "190", nomeInquilino: "Francisca Íris", dataEntrada: "2024-03-26", dataSaida: "2028-03-26",
    caucao: 600, aluguel: 532, diaPagamento: 20, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "196", nomeInquilino: "Fátima", dataEntrada: null, dataSaida: null,
    caucao: 550, aluguel: 550, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
];

const prop4Inquilinos: InquilinoSeed[] = [
  {
    casa: "846I", nomeInquilino: "Aline Ribeiro da Silva", dataEntrada: "2025-07-21", dataSaida: "2028-07-21",
    caucao: 600, aluguel: 639, diaPagamento: 30, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "864F", nomeInquilino: "Camila Cássia dos Santos", dataEntrada: "2025-07-21", dataSaida: "2028-07-21",
    caucao: 450, aluguel: 639, diaPagamento: 18, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "863", nomeInquilino: "Francisca F. Costa Lopes", dataEntrada: "2025-07-30", dataSaida: "2028-07-30",
    caucao: 600, aluguel: 639, diaPagamento: 28, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "851-C", nomeInquilino: "Jocineide dos Santos Silva", dataEntrada: "2025-07-30", dataSaida: "2028-07-30",
    caucao: 600, aluguel: 639, diaPagamento: 20, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "839-E", nomeInquilino: "José Matos Vitoriano Filho", dataEntrada: "2025-07-30", dataSaida: "2028-07-30",
    caucao: 550, aluguel: 639, diaPagamento: 30, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "858G", nomeInquilino: "Joziane Henrique da Silva", dataEntrada: "2025-07-30", dataSaida: "2028-07-30",
    caucao: 450, aluguel: 639, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "845D", nomeInquilino: "Marcia Paiva do N. Costa", dataEntrada: "2022-09-19", dataSaida: "2027-09-19",
    caucao: 450, aluguel: 600, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "863B", nomeInquilino: "Maria Aureni P. Cordeir", dataEntrada: "2025-07-30", dataSaida: "2028-07-30",
    caucao: 639, aluguel: 639, diaPagamento: 12, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "846", nomeInquilino: "Fabiana Reis", dataEntrada: "2023-07-25", dataSaida: "2028-07-25",
    caucao: 600, aluguel: 550, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "852H", nomeInquilino: "José Wanderson", dataEntrada: "2025-07-30", dataSaida: "2028-07-30",
    caucao: 700, aluguel: 639, diaPagamento: 10, status: "ativo",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "864", nomeInquilino: "José Sérgio", dataEntrada: "2024-06-20", dataSaida: "2025-06-20",
    caucao: 600, aluguel: 550, diaPagamento: 20, status: "encerrado",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "845", nomeInquilino: "Francisca Altanades", dataEntrada: "2024-11-06", dataSaida: "2025-11-06",
    caucao: 600, aluguel: 550, diaPagamento: 10, status: "encerrado",
    pagamentos2025: ["pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "836A", nomeInquilino: "Lia Sousa", dataEntrada: null, dataSaida: null,
    caucao: 600, aluguel: 600, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,"caucao","pago","pago","pago","pago","pago","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "836", nomeInquilino: "Vladia", dataEntrada: "2025-07-12", dataSaida: "2028-07-12",
    caucao: 600, aluguel: 600, diaPagamento: 28, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,"caucao","pago","pago","pago","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "839", nomeInquilino: "Monize", dataEntrada: null, dataSaida: null,
    caucao: 600, aluguel: 600, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,"caucao","pago","caucao","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "836", nomeInquilino: "Ana Valeska", dataEntrada: "2025-10-20", dataSaida: null,
    caucao: 600, aluguel: 600, diaPagamento: 15, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,"caucao","caucao","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "852", nomeInquilino: "Helayne", dataEntrada: "2025-10-20", dataSaida: null,
    caucao: 600, aluguel: 600, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,null,"caucao","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "851", nomeInquilino: "Bruno Kern", dataEntrada: "2025-10-23", dataSaida: "2028-10-23",
    caucao: 600, aluguel: 600, diaPagamento: 10, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,null,"caucao","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
  {
    casa: "857B", nomeInquilino: "Antonia Natercia", dataEntrada: null, dataSaida: null,
    caucao: 600, aluguel: 600, diaPagamento: null, status: "ativo",
    pagamentos2025: [null,null,null,null,null,null,null,null,"caucao","caucao","pago","pago"],
    pag_jan2026: "pago", pag_fev2026: null
  },
];

async function seed() {
  console.log("🌱 Iniciando seed...");

  // Inserir propriedades
  const props = await db.insert(propriedades).values([
    { nome: "Rua Gabriel Gomes Barbosa", endereco: "Rua Gabriel Gomes Barbosa - Bessalândia", cidade: "Bessalândia" },
    { nome: "Rua Sigefredo Bessa", endereco: "Rua Sigefredo Bessa - Bessalândia", cidade: "Bessalândia" },
    { nome: "Rua Prof. Julia de Melo", endereco: "Rua Prof. Julia de Melo - Bessalândia", cidade: "Bessalândia" },
    { nome: "Rua Luciano Rodrigues", endereco: "Rua Luciano Rodrigues - Rio Novo", cidade: "Rio Novo" },
  ]);

  console.log("✅ Propriedades inseridas");

  // Buscar IDs das propriedades
  const rawResult = await (db as any).execute("SELECT id, nome FROM propriedades ORDER BY id");
  const propRows = Array.isArray(rawResult[0]) ? rawResult[0] : rawResult;
  const propIds = (propRows as any[]).map((r: any) => Number(r.id));

  const allGroups = [
    { propId: propIds[0], inquilinos: prop1Inquilinos },
    { propId: propIds[1], inquilinos: prop2Inquilinos },
    { propId: propIds[2], inquilinos: prop3Inquilinos },
    { propId: propIds[3], inquilinos: prop4Inquilinos },
  ];

  for (const group of allGroups) {
    for (const inq of group.inquilinos) {
      const [contratoResult] = await db.insert(contratos).values({
        propriedadeId: group.propId,
        casa: inq.casa,
        nomeInquilino: inq.nomeInquilino,
        dataEntrada: inq.dataEntrada ? new Date(inq.dataEntrada) : null,
        dataSaida: inq.dataSaida ? new Date(inq.dataSaida) : null,
        caucao: String(inq.caucao),
        aluguel: String(inq.aluguel),
        diaPagamento: inq.diaPagamento,
        status: inq.status,
      });

      const contratoId = (contratoResult as any).insertId as number;

      // Inserir pagamentos 2025
      const pagamentosParaInserir: typeof pagamentos.$inferInsert[] = [];

      for (let i = 0; i < MESES_2025.length; i++) {
        const st = inq.pagamentos2025[i];
        if (st !== null) {
          pagamentosParaInserir.push({
            contratoId,
            ano: 2025,
            mes: MESES_2025[i],
            status: st,
            valorPago: st === "pago" ? String(inq.aluguel) : null,
          });
        }
      }

      // Janeiro 2026
      if (inq.pag_jan2026 !== null) {
        pagamentosParaInserir.push({
          contratoId,
          ano: 2026,
          mes: 1,
          status: inq.pag_jan2026,
          valorPago: inq.pag_jan2026 === "pago" ? String(inq.aluguel) : null,
        });
      }

      // Fevereiro 2026
      if (inq.pag_fev2026 !== null) {
        pagamentosParaInserir.push({
          contratoId,
          ano: 2026,
          mes: 2,
          status: inq.pag_fev2026,
          valorPago: inq.pag_fev2026 === "pago" ? String(inq.aluguel) : null,
        });
      }

      if (pagamentosParaInserir.length > 0) {
        await db.insert(pagamentos).values(pagamentosParaInserir);
      }
    }
  }

  console.log("✅ Contratos e pagamentos inseridos!");
  console.log("🎉 Seed concluído com sucesso!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Erro no seed:", err);
  process.exit(1);
});
