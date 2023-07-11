/*
 * Copyright (C) 2009-2021 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.define(["sap/ui/model/resource/ResourceModel","sap/ui/model/json/JSONModel","sap/m/MessageBox"],function(R,J,M){"use strict";return{_initAndOpenEditTimeForOADialog:function(v,o,c,C){this.oView=v;this.oOperationActyContexts=o;this.fnCallBackOnSave=c;this.fnCallBackOnCancel=C;if(!this._oEditTimeForOADialog){this._oEditTimeForOADialog=sap.ui.xmlfragment("i2d.mpe.workassign.manages1.ext.fragment.EditTimeForOADialog",this);this._oEditTimeForOADialog.setModel(v.getModel("i18n"),"i18n");}sap.ui.getCore().byId("idEditTimeForOADialogSaveButtonText").setEnabled(true);sap.ui.getCore().byId("inputTime").setValueState(sap.ui.core.ValueState.None);sap.ui.getCore().byId("inputTime").setValue("");var l=this.checkLaborTrackingOfAllSelectedOAs(this.oOperationActyContexts);if(l===0){sap.ui.getCore().byId("idTargetTimeLable").setText(this.oView.getModel("i18n").getResourceBundle().getText("TargetOATime"));}else if(l===1){sap.ui.getCore().byId("idTargetTimeLable").setText(this.oView.getModel("i18n").getResourceBundle().getText("TargetLaborTime"));}else if(l===2){sap.ui.getCore().byId("idTargetTimeLable").setText(this.oView.getModel("i18n").getResourceBundle().getText("TargetOATargetLaborTime"));}this._oEditTimeForOADialog.open();},onEditTimeForOADialogLiveChange:function(e){if(Number(e.getParameter("newValue"))>9999){e.getSource().setValueState(sap.ui.core.ValueState.Error);sap.ui.getCore().byId("idEditTimeForOADialogSaveButtonText").setEnabled(false);}else if(Number(e.getParameter("newValue"))<0){e.getSource().setValueState(sap.ui.core.ValueState.Error);sap.ui.getCore().byId("idEditTimeForOADialogSaveButtonText").setEnabled(false);}else{e.getSource().setValueState(sap.ui.core.ValueState.None);sap.ui.getCore().byId("idEditTimeForOADialogSaveButtonText").setEnabled(true);}},onEditTimeForOADialogCancel:function(e){this._oEditTimeForOADialog.close();if(this.fnCallBackOnCancel){this.fnCallBackOnCancel(e);}},onEditTimeForOADialogSaveTime:function(e){var t=0;var i=function(s){var n=Math.floor(Number(s));return n!==Infinity&&String(n)===s&&n>=0;};if(i(sap.ui.getCore().byId("inputTime").getValue())){switch(sap.ui.getCore().byId("selectTimeUnit").getSelectedKey()){case"S":t=sap.ui.getCore().byId("inputTime").getValue();break;case"MIN":t=sap.ui.getCore().byId("inputTime").getValue()*60;break;case"HOUR":t=sap.ui.getCore().byId("inputTime").getValue()*3600;break;case"DAY":t=sap.ui.getCore().byId("inputTime").getValue()*86400;break;default:t=sap.ui.getCore().byId("inputTime").getValue();break;}this.functionImportEditTargetTime(this.oOperationActyContexts,t,true);if(this.fnCallBackOnSave){this.fnCallBackOnSave(e);}}else{M.error(this.oView.getModel("i18n").getResourceBundle().getText("EnterValidTimeMessage"));}},functionImportEditTargetTime:function(o,t,s){var a=this;var S=s;var g=jQuery.sap.uid();this.oView.getModel().setDeferredGroups([g]);a._oEditTimeForOADialog.setBusy(true);o.forEach(function(O,i,b){var c=O.getObject();a.oView.getModel().callFunction("/C_ProcgExecOpActyInstceTPExpd_exec_durn",{groupId:g,method:"POST",urlParameters:{"OpActyNtwkInstance":c.OpActyNtwkInstance,"OpActyNtwkElement":c.OpActyNtwkElement,"ExpdExecDurn":t},success:function(d,r){},error:function(e){var r=e.responseText;if(r!==undefined){var d;try{d=JSON.parse(r);var m=d.error.message.value;sap.ui.core.BusyIndicator.hide();if(!this._bMessageOpen){this._bMessageOpen=true;sap.m.MessageBox.error(m,{id:"backEndErrorMessageBox",title:a.oView.getModel("i18n").getResourceBundle().getText("TimeAssignmentErrorMessage"),actions:[sap.m.MessageBox.Action.CLOSE],onClose:function(){this._bMessageOpen=false;}.bind(this)});}}catch(f){sap.m.MessageToast.show(a.oView.getModel("i18n").getResourceBundle().getText("TimeAssignmentErrorMessage"));}}S=false;}});});this.oView.getModel().submitChanges({groupId:g,success:function(d){if(S){sap.m.MessageToast.show(a.oView.getModel("i18n").getResourceBundle().getText("TimeAssignmentSuccessToast"));}a.oView.getModel().refresh(true);a._oEditTimeForOADialog.setBusy(false);a._oEditTimeForOADialog.close();},error:function(e){a.oView.getModel().refresh(true);a._oEditTimeForOADialog.setBusy(false);a._oEditTimeForOADialog.close();jQuery.sap.log.error(e.responseText);}});},checkLaborTrackingOfAllSelectedOAs:function(o){var i=0;var l=undefined;o.forEach(function(O,a,b){var c=O.getObject();if(l===undefined){l=c.LaborTrackingIsRequired;i=l?1:0;}else{if(l!==c.LaborTrackingIsRequired){i=2;return i;}}});return i;}};});
