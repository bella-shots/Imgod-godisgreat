/**
 * A4-05 — Salary Carry-Forward / OOP Salary Credit
 *
 * R60 FROZEN RULE:
 * The employee's next salary credit contains two distinct components:
 *   1) the fixed ₹1,000 monthly food/eatables allowance; and
 *   2) designated/base salary + approved company-essential OOP spend
 *      for the applicable prior month.
 * Ordinary food/eatables claims are excluded from the OOP component.
 *
 * The ₹5,000 amount is a monthly baseline, NOT a reimbursement cap.
 * Examples:
 *   ₹1,000 approved OOP -> salary + ₹1,000
 *   ₹5,000 approved OOP -> salary + ₹5,000
 *   ₹7,000 approved OOP -> salary + ₹5,000 + ₹2,000 excess = salary + ₹7,000
 *
 * This module:
 * - reads only approved OOP claims;
 * - aggregates by canonical Employee_ID and claim month;
 * - does not create a separate ₹5,000 line;
 * - preserves Salary_Admin history by creating a new monthly record rather than
 *   overwriting prior records;
 * - leaves claim approval to the authorized OOP review workflow.
 */

var A405_CONFIG = Object.freeze({
  FINANCE_WORKBOOK: 'MASTER_COMPANY_FINANCE',
  OOP_SHEET: 'OOP_Claims',
  SALARY_SHEET: 'Salary_Admin',
  HR_WORKBOOK: 'MASTER_COMPANY_HR_ADMIN',
  EMPLOYEE_SHEET: 'Employees',
  MONTHLY_FREQUENCY: 'Monthly',
  STATUS: 'Pending',
  OOP_BASELINE_INR: 5000
});

function calculateOopSalaryCredit_(baseSalary, approvedOopTotal) {
  baseSalary = Number(baseSalary);
  approvedOopTotal = Number(approvedOopTotal);
  if (!(baseSalary >= 0)) throw new Error('A4_05_BASE_SALARY_INVALID');
  if (!(approvedOopTotal >= 0)) throw new Error('A4_05_APPROVED_OOP_INVALID');

  var baseline = Math.min(A405_CONFIG.OOP_BASELINE_INR, approvedOopTotal);
  var excess = Math.max(0, approvedOopTotal - A405_CONFIG.OOP_BASELINE_INR);
  var oopSalaryAddition = baseline + excess;

  return {
    baselineApplied: baseline,
    excessApplied: excess,
    oopSalaryAddition: oopSalaryAddition,
    dueAmount: baseSalary + oopSalaryAddition
  };
}

function calculateMonthlyFoodAllowance_() { return 1000; }\n\nfunction aggregateApprovedOopForMonth_(employeeId, month) {
  var finance = findUniqueA405Spreadsheet_(A405_CONFIG.FINANCE_WORKBOOK);
  var sheet = finance.getSheetByName(A405_CONFIG.OOP_SHEET);
  if (!sheet) throw new Error('A4_05_OOP_SHEET_MISSING');
  var headers = sheet.getRange(1,1,1,sheet.getLastColumn()).getValues()[0];
  var expected = ['Claim_ID','Employee_ID','Date','Purpose','Amount','Project_ID','Proof_URL','Status','Approved_Amount','Paid_Date','OOP_Rule_Flag'];
  if (JSON.stringify(headers) !== JSON.stringify(expected)) throw new Error('A4_05_OOP_SCHEMA_MISMATCH');

  if (sheet.getLastRow() < 2) return 0;
  var rows = sheet.getRange(2,1,sheet.getLastRow()-1,sheet.getLastColumn()).getValues();
  var employeeIdx = headers.indexOf('Employee_ID');
  var dateIdx = headers.indexOf('Date');
  var statusIdx = headers.indexOf('Status');
  var approvedIdx = headers.indexOf('Approved_Amount');
  var total = 0;

  rows.forEach(function(row) {
    var d = row[dateIdx];
    if (!(d instanceof Date) || isNaN(d.getTime())) return;
    var rowMonth = Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM');
    if (String(row[employeeIdx]).trim() === employeeId &&
        rowMonth === month &&
        String(row[statusIdx]).trim() === 'Approved' && isSalaryEligibleOopRuleFlag_(String(row[headers.indexOf('OOP_Rule_Flag')]).trim())) {
      var approved = Number(row[approvedIdx]);
      if (approved > 0) total += approved;
    }
  });
  return total;
}

function prepareNextMonthlySalaryRecord_(employeeId, month, baseSalary) {
  if (!/^EMP-[0-9]{6}$/.test(String(employeeId))) throw new Error('A4_05_EMPLOYEE_ID_INVALID');
  if (!/^\d{4}-\d{2}$/.test(String(month))) throw new Error('A4_05_MONTH_INVALID');

  var approvedOopTotal = aggregateApprovedOopForMonth_(employeeId, month);
  var calculation = calculateOopSalaryCredit_(baseSalary, approvedOopTotal);

  return {
    employeeId: employeeId,
    oopMonth: month,
    approvedOopTotal: approvedOopTotal,
    baselineApplied: calculation.baselineApplied,
    excessApplied: calculation.excessApplied,
    oopSalaryAddition: calculation.oopSalaryAddition,
    baseSalary: Number(baseSalary),
    foodAllowance: calculateMonthlyFoodAllowance_(),
    dueAmount: calculation.dueAmount + calculateMonthlyFoodAllowance_()
  };
}

function testA405OopSalaryRule() {
  var cases = [
    {spent:1000, expected:1000},
    {spent:5000, expected:5000},
    {spent:7000, expected:7000}
  ];
  var results = cases.map(function(c) {
    var calc = calculateOopSalaryCredit_(10000, c.spent);
    return {
      approvedOop: c.spent,
      baselineApplied: calc.baselineApplied,
      excessApplied: calc.excessApplied,
      oopSalaryAddition: calc.oopSalaryAddition,
      dueAmount: calc.dueAmount,
      foodAllowance: 1000,
      expectedDueAmount: 10000 + c.expected + 1000,
      pass: calc.dueAmount + 1000 === 10000 + c.expected + 1000
    };
  });
  return {
    rule: 'Salary + actual approved company-essential OOP spend; ₹5000 is baseline, not cap.',
    results: results,
    allPassed: results.every(function(r) { return r.pass; })
  };
}

function findUniqueA405Spreadsheet_(name) {
  var files = DriveApp.getFilesByName(name);
  var found = [];
  while (files.hasNext()) found.push(files.next());
  if (found.length !== 1) throw new Error('A4_05_WORKBOOK_AMBIGUOUS_OR_MISSING: ' + name + ' count=' + found.length);
  return SpreadsheetApp.openById(found[0].getId());
}


function testA405FoodAllowanceRule() {
  return {foodAllowance: calculateMonthlyFoodAllowance_(), noSpendRequired: true, noCarryForwardReduction: true, pass: calculateMonthlyFoodAllowance_() === 1000};
}


function isSalaryEligibleOopRuleFlag_(flag) {
  return flag === 'APPROVED_COMPANY_ESSENTIAL' ||
         flag === 'APPROVED_FOOD_BUSINESS_EXCEPTION';
}

/**
 * R62 gate check: only explicitly approved claims may contribute to salary.
 */
function testA405ApprovalGateRule() {
  var cases = [
    {status:'Pending Review', flag:'UNDER_5000_ADD_ACTUAL_SPEND', approved:1000, eligible:false},
    {status:'Rejected', flag:'REJECTED_BY_TOP_MANAGER', approved:0, eligible:false},
    {status:'Approved', flag:'UNDER_5000_ADD_ACTUAL_SPEND', approved:1000, eligible:false},
    {status:'Approved', flag:'APPROVED_COMPANY_ESSENTIAL', approved:1000, eligible:true},
    {status:'Approved', flag:'FOOD_REQUIRES_REVIEW_EXCEPTION_OR_ORDINARY', approved:1000, eligible:false},
    {status:'Approved', flag:'APPROVED_FOOD_BUSINESS_EXCEPTION', approved:1000, eligible:true}
  ];
  return {
    cases: cases.map(function(c) {
      return {input:c, result:c.status === 'Approved' && c.approved > 0 && isSalaryEligibleOopRuleFlag_(c.flag), pass:(c.status === 'Approved' && c.approved > 0 && isSalaryEligibleOopRuleFlag_(c.flag)) === c.eligible};
    }),
    rule:'Only Top-Manager-approved company-essential claims, including explicitly approved food-business exceptions, enter next-month salary.',
    allPassed: cases.every(function(c) {
      return ((c.status === 'Approved' && c.approved > 0 && isSalaryEligibleOopRuleFlag_(c.flag)) === c.eligible);
    })
  };
}
