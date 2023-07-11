/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("i2d.mpe.mfguser.manages1.ext.controller.ObjectPageExt",{onBeforeRebindTableExtension:function(e){this.getView().getModel().refresh(true);},onClickUserWCAddButton:function(e){if(!this.AddWorkCenterAssignmentDialog){this.AddWorkCenterAssignmentDialog=sap.ui.xmlfragment("AddWorkCenterAssignmentDialog","i2d.mpe.mfguser.manages1.ext.fragment.AddWorkCenterAssignment",this);this.getView().addDependent(this.AddWorkCenterAssignmentDialog);this.AddWorkCenterAssignmentDialog.setModel(this.getOwnerComponent().getModel('i18n'),"i18n");}var c=this.getView().getModel().createEntry(this.getOwnerComponent().getBindingContext().getPath()+"/to_MfgBPWrkCtr",{groupId:"Changes",changeSetId:"Changes",batchGroupId:"Changes"},{success:$.proxy(function(D){},this),error:jQuery.proxy(function(E){var C=!!this.getView().$().closest(".sapUiSizeCompact").length;this.getView().setBusy(false);sap.m.MessageBox.error(JSON.parse(E.responseText).error.message.value,{styleClass:C?"sapUiSizeCompact":""});},this)});if(c){this.AddWorkCenterAssignmentDialog.setBindingContext(c);this.AddWorkCenterAssignmentDialog.open();var a=new Date();sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","ValidityStartDate")).setValue(a);var l=new Date();l.setYear("9999");l.setMonth("11");l.setDate("31");sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","ValidityEndDate")).setValue(l);}},onValueChange:function(e){var s=e.getSource();var p=s._getBindingContext().getPath();var b=s.getBindingInfo("value");var a=b.parts[0].path;var n=e.getParameters().newValue;if(a==="WorkCenter"||a==="Plant"){this.getOwnerComponent().getModel().setProperty(""+p+"/"+a+"",n);var W=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","WorkCenter"));var P=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","Plant"));W.setValueState(sap.ui.core.ValueState.None);P.setValueState(sap.ui.core.ValueState.None);}else if(a==="MfgQualifnCertExprtnDate"&&n===""){this.getOwnerComponent().getModel().setProperty(""+p+"/"+a+"",undefined);}},onDefaultChange:function(e){var E=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog","ValidityEndDate"));E.setValueState(sap.ui.core.ValueState.None);},onCreateWCOKPress:function(e){var v=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","WorkCenter")).getValueState();var a=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","Plant")).getValueState();var b=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","ValidityStartDate")).getValueState();var c=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","ValidityEndDate")).getValueState();if(b==="None"&&c==="None"){var p=this.AddWorkCenterAssignmentDialog.getBindingContext().getPath();var w=this.getOwnerComponent().getModel().getProperty(p).WorkCenter;var d=this.getOwnerComponent().getModel().getProperty(p).Plant;var M=this.getView().getBindingContext().getProperty("MfgBusinessPartner");this.getOwnerComponent().getModel().setProperty(""+p+"/MfgBusinessPartner",M);if(d===undefined){var E=this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("EnterPlant");sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","Plant")).setValueState(sap.ui.core.ValueState.Error);sap.m.MessageToast.show(E);this.AddWorkCenterAssignmentDialog.setBusy(false);}if(w===undefined){E=this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("EnterWC");sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","WorkCenter")).setValueState(sap.ui.core.ValueState.Error);sap.m.MessageToast.show(E);this.AddWorkCenterAssignmentDialog.setBusy(false);}if(v==="None"&&a==="None"){if(w.length>8){E=this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("workCenterTooLong");sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","WorkCenter")).setValueState(sap.ui.core.ValueState.Error);sap.m.MessageToast.show(E);this.AddWorkCenterAssignmentDialog.setBusy(false);}else if(d.length>4){E=this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("plantTooLong");sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","Plant")).setValueState(sap.ui.core.ValueState.Error);sap.m.MessageToast.show(E);this.AddWorkCenterAssignmentDialog.setBusy(false);}else{var f=this.getOwnerComponent().getModel().hasPendingChanges();if(f===true){this.getOwnerComponent().getModel().submitChanges({success:jQuery.proxy(function(g){var r=g.__batchResponses[g.__batchResponses.length-1];var h=Object.keys(r);var j=false;for(var i in h){if(h[i]==="__changeResponses"){j=true;}}if(j){if(r.__changeResponses[r.__changeResponses.length-1].statusCode==="201"){var W=this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("WCAddSuccessMsg",[r.__changeResponses[r.__changeResponses.length-1].data.WorkCenter]);sap.m.MessageToast.show(W);this.getOwnerComponent().getModel().refresh(true);this.getOwnerComponent().getModel().resetChanges();this.AddWorkCenterAssignmentDialog.close();}}else{var k=g.__batchResponses[0].response.body;var l=JSON.parse(k);var E=l.error.message.value;var V=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","ValidityEndDate"));var m=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","WorkCenter"));var n=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","ValidityStartDate"));var P=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddWorkCenterAssignmentDialog","Plant"));if(l.error.code==="MPE_USER_GROUP_MSGS/028"||l.error.code==="MPE_USER_GROUP_MSGS/030"||l.error.code==="MPE_USER_GROUP_MSGS/031"||l.error.code==="MPE_USER_GROUP_MSGS/034"){V.setValueState(sap.ui.core.ValueState.Error);V.setValueStateText(E);}else if(l.error.code==="MPE_USER_GROUP_MSGS/033"||l.error.code==="MPE_USER_GROUP_MSGS/007"||l.error.code==="MPE_USER_GROUP_MSGS/008"||l.error.code==="MPE_USER_GROUP_MSGS/035"){m.setValueState(sap.ui.core.ValueState.Error);m.setValueStateText(E);}else if(l.error.code==="MPE_USER_GROUP_MSGS/025"){m.setValueState(sap.ui.core.ValueState.Error);P.setValueState(sap.ui.core.ValueState.Error);m.setValueStateText(E);P.setValueStateText(E);}else if(l.error.code==="MPE_USER_GROUP_MSGS/029"||l.error.code==="MPE_USER_GROUP_MSGS/032"){n.setValueState(sap.ui.core.ValueState.Error);n.setValueStateText(E);}else if(l.error.code==="MPE_USER_GROUP_MSGS/018"||l.error.code==="MPE_USER_GROUP_MSGS/019"){P.setValueState(sap.ui.core.ValueState.Error);P.setValueStateText(E);}else if(l.error.code==="MPE_USER_GROUP_MSGS/027"){this.getOwnerComponent().getModel().refresh(true);this.AddWorkCenterAssignmentDialog.close();sap.m.MessageToast.show(E);}else{sap.m.MessageToast.show(E);}}this.getOwnerComponent().getModel().refresh(true);},this),error:jQuery.proxy(function(g){this.getOwnerComponent().getModel().resetChanges();this.AddWorkCenterAssignmentDialog.close();},this)});}}}}},onCreateWCClosePress:function(){this.getOwnerComponent().getModel().resetChanges();this.AddWorkCenterAssignmentDialog.close();},onClickUserWCEditButton:function(e){var c=this.extensionAPI.getSelectedContexts("to_MfgBPWrkCtr::com.sap.vocabularies.UI.v1.LineItem::Table")[0];if(c){var p=c.getPath();if(p){if(!this.EditWCAssignmentDialog){this.EditWCAssignmentDialog=sap.ui.xmlfragment("EditWCAssignmentDialog","i2d.mpe.mfguser.manages1.ext.fragment.EditWorkCenterAssignment",this);this.getView().addDependent(this.EditWCAssignmentDialog);this.EditWCAssignmentDialog.setModel(this.getOwnerComponent().getModel("i18n"),"i18n");}this.EditWCAssignmentDialog.bindElement(p);sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog","ValidityStartDate")).setValueState(sap.ui.core.ValueState.None);sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog","ValidityEndDate")).setValueState(sap.ui.core.ValueState.None);this.EditWCAssignmentDialog.open();}}else{var n=this.getView().getModel("i18n").getResourceBundle().getText("noCertSelectedForEditing");sap.m.MessageToast.show(n);}},onEditWCOKPress:function(){var v=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog","ValidityStartDate")).getValueState();var a=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog","ValidityEndDate")).getValueState();if(v==="None"&&a==="None"){var p=this.EditWCAssignmentDialog.getBindingContext().getPath();var e=this.getOwnerComponent().getModel().getProperty(p).WorkCenter;var b=this.getView().getBindingContext().getPath();var c=this.getOwnerComponent().getModel().getProperty(b);var M=c.MfgBusinessPartner;this.getOwnerComponent().getModel().setProperty(""+p+"/MfgBusinessPartner",M);var d=this.getOwnerComponent().getModel().hasPendingChanges();if(d===true){this.getOwnerComponent().getModel().submitChanges({success:jQuery.proxy(function(f){this.EditWCAssignmentDialog.setBusy(false);var r=f.__batchResponses[f.__batchResponses.length-1];var g=Object.keys(r);var h=false;for(var i in g){if(g[i]==="__changeResponses"){h=true;}}if(h){if(r.__changeResponses[r.__changeResponses.length-1].statusCode==="204"){var W=this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("WCEditSuccessMsg",[e]);sap.m.MessageToast.show(W);this.getOwnerComponent().getModel().refresh(true);this.getOwnerComponent().getModel().resetChanges();this.EditWCAssignmentDialog.close();}}else{var j=f.__batchResponses[0].response.body;var k=JSON.parse(j);var E=k.error.message.value;if(k.error.code==="MPE_USER_GROUP_MSGS/028"||k.error.code==="MPE_USER_GROUP_MSGS/030"||k.error.code==="MPE_USER_GROUP_MSGS/031"||k.error.code==="MPE_USER_GROUP_MSGS/034"){var V=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog","ValidityEndDate"));V.setValueState(sap.ui.core.ValueState.Error);V.setValueStateText(E);}else if(k.error.code==="MPE_USER_GROUP_MSGS/029"||k.error.code==="MPE_USER_GROUP_MSGS/032"){var l=sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditWCAssignmentDialog","ValidityStartDate"));l.setValueState(sap.ui.core.ValueState.Error);l.setValueStateText(E);}else if(k.error.code==="MPE_USER_GROUP_MSGS/027"){this.getOwnerComponent().getModel().refresh(true);sap.m.MessageToast.show(E);this.EditWCAssignmentDialog.close();}else{sap.m.MessageToast.show(E);}}this.getOwnerComponent().getModel().refresh(true);},this),error:jQuery.proxy(function(f){this.getOwnerComponent().getModel().resetChanges();this.getOwnerComponent().getModel().refresh(true);this.EditWCAssignmentDialog.close();},this)});}else{this.EditWCAssignmentDialog.close();}}},onEditWCClosePress:function(e){this.getOwnerComponent().getModel().resetChanges();this.EditWCAssignmentDialog.close();},onClickUserWCDeleteButton:function(e){var c=this.extensionAPI.getSelectedContexts("to_MfgBPWrkCtr::com.sap.vocabularies.UI.v1.LineItem::Table")[0];if(c){var p=c.getPath();this.DeletePath=p;if(p){if(!this.DeleteWCAssignmentDialog){this.DeleteWCAssignmentDialog=sap.ui.xmlfragment("i2d.mpe.mfguser.manages1.ext.fragment.DeleteWorkCenterAssignment",this);this.getView().addDependent(this.DeleteWCAssignmentDialog);this.DeleteWCAssignmentDialog.setModel(this.getOwnerComponent().getModel("i18n"),"i18n");}this.DeleteWCAssignmentDialog.bindElement(p);this.DeleteWCAssignmentDialog.open();}}else{var n=this.getView().getModel("i18n").getResourceBundle().getText("noWCSelectedForDeleting");sap.m.MessageToast.show(n);}},onDeleteWCOKPress:function(e){this.DeleteWCAssignmentDialog.setBusy(true);var p=this.DeleteWCAssignmentDialog.getBindingContext().getPath();var d=this.getOwnerComponent().getModel().getProperty(p).WorkCenter;this.getOwnerComponent().getModel().remove(p,{success:jQuery.proxy(function(){this.DeleteWCAssignmentDialog.setBusy(false);this.DeleteWCAssignmentDialog.close();var i=this.createId("to_MfgBPWrkCtr::com.sap.vocabularies.UI.v1.LineItem::Table");var t=this.getView().byId(i);t.rebindTable();var W=this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("WCDeleteSuccessMsg",[d]);sap.m.MessageToast.show(W);},this),error:jQuery.proxy(function(a){if(a){var b=JSON.parse(a.responseText);var c=b.error.message.value;sap.m.MessageToast.show(c);this.DeleteWCAssignmentDialog.setBusy(false);this.DeleteWCAssignmentDialog.close();this.getOwnerComponent().getModel().resetChanges();}},this)});},onDeleteWCClosePress:function(e){this.DeleteWCAssignmentDialog.close();}});