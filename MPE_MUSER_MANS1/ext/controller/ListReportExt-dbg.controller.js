/*
 * Copyright (C) 2009-2020 SAP SE or an SAP affiliate company. All rights reserved.
 */
sap.ui.controller("i2d.mpe.mfguser.manages1.ext.controller.ListReportExt", {

	onInit: function () {
		var lrFilter = this.getView().byId(this.createId("listReportFilter"));
		var that = this;
		lrFilter.attachInitialized(function (oEvent) {
			var filterCert = oEvent.getSource();
			filterCert._getFilterItemByName("BusinessPartnerName").setLabel(that.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
				"UsernameFilter"));
			filterCert.setShowMessages(false);
		});
	},

	onBeforeRebindTableExtension: function (oEvent) {
		var oParams = oEvent.getParameters();
		oParams.bindingParams.sorter.push(new sap.ui.model.Sorter("BusinessPartnerName"));
	},

	// onClickUserCertificationAssignButton: function (oEvent) {

	// 	var oApi = this.extensionAPI;
	// 	if (oApi.getSelectedContexts().length > 0) {

	// 		var path = oApi.getSelectedContexts();
	// 		var sPath = path[0].sPath;
	// 		var MfgBusinessPartner = this.getOwnerComponent().getModel().getProperty(sPath + "/MfgBusinessPartner");
	// 		var oCrossAppNav = sap.ushell && sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation");
	// 		var sIntent = "ManufacturingCertification-manageUserAssignment";
	// 		var oArgs = {
	// 			target: {
	// 				semanticObject: "ManufacturingCertification",
	// 				action: "manageUserAssignment&/C_MfgBusinessPartnerTP(" + "'" + +MfgBusinessPartner + "'" + ")"
	// 			}
	// 		};

	// 		oCrossAppNav
	// 			.isNavigationSupported([sIntent])
	// 			.done(function (oData) {
	// 				if (oData[0].supported) {
	// 					if (oCrossAppNav) {
	// 						/* eslint-disable sap-cross-application-navigation */
	// 						oCrossAppNav.toExternal(oArgs);
	// 						/* eslint-enable sap-cross-application-navigation */
	// 					}
	// 				}
	// 			});
	// 	}

	// },

	onClickUserAddButton: function (oEvent) {

		if (!this.AddBusinessPartnerDialog) {
			this.AddBusinessPartnerDialog = sap.ui.xmlfragment("AddBusinessPartnerDialog",
				"i2d.mpe.mfguser.manages1.ext.fragment.AddBusinessPartner", this);
			this.getView().addDependent(this.AddBusinessPartnerDialog);
			this.AddBusinessPartnerDialog.setModel(this.getOwnerComponent().getModel('i18n'), "i18n");
		}
		var oView = this.getView();
		var oContext = oView.getModel().createEntry("/C_MfgBusinessPartnerTP", {
			groupId: "Changes",
			changeSetId: "Changes",
			batchGroupId: "Changes",
			method: "POST"
		}, {
			success: $.proxy(function (Data) {}, this),
			error: jQuery.proxy(function (oError) {
				var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;
				this.getView().setBusy(false);
				sap.m.MessageBox.error(
					JSON.parse(oError.responseText).error.message.value, {
						styleClass: bCompact ? "sapUiSizeCompact" : ""
					}
				);
			}, this)
		});
		if (oContext) {
			this.AddBusinessPartnerDialog.setBindingContext(oContext);
			this.AddBusinessPartnerDialog.open();
		}
	},

	onChange: function (oEvent) {
		var source = oEvent.getSource();
		var sPath = source._getBindingContext().getPath();
		var bindingInfo = source.getBindingInfo("value");
		var path = bindingInfo.parts[0].path;
		var newValue = oEvent.getParameters().newValue;
		this.getOwnerComponent().getModel().setProperty("" + sPath + "/" + path + "", newValue);
	},

	onCreateBPAddPress: function (oEvent) {
		
		var sPath = this.AddBusinessPartnerDialog.getBindingContext().getPath();
		var value = this.getOwnerComponent().getModel().getProperty(sPath);
		if (value.MfgBusinessPartner === undefined){
			var ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("enterBP");
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddBusinessPartnerDialog", "MfgBusinessPartner")).setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageToast.show(ErrorMSG);
			this.AddBusinessPartnerDialog.setBusy(false);
		} else if (value.WorkCenter !== undefined && value.WorkCenter.length > 8) {
			ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("workCenterTooLong");
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddBusinessPartnerDialog", "WorkCenter")).setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageToast.show(ErrorMSG);
			this.AddBusinessPartnerDialog.setBusy(false);
		} else if (value.Plant !== undefined && value.Plant.length > 4) {
			ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("plantTooLong");
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddBusinessPartnerDialog", "Plant")).setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageToast.show(ErrorMSG);
			this.AddBusinessPartnerDialog.setBusy(false);
		} else {
			this.getOwnerComponent().getModel().submitChanges({
				groupId: "Changes",
				changeSetId: "Changes",
				batchGroupId: "Changes",

				success: $.proxy(function (successResponse) {
					var sPath = this.AddBusinessPartnerDialog.getBindingContext().getPath();
					var addedUserName = this.getOwnerComponent().getModel().getProperty(sPath).BusinessPartnerName;
					var response = successResponse.__batchResponses[successResponse.__batchResponses.length - 1];
					var responseKeys = Object.keys(response);
					var check = false;
					for (var i in responseKeys) {
						if (responseKeys[i] === "__changeResponses") {
							check = true;
						}
					}

					if (check) {
						if (response.__changeResponses[response.__changeResponses.length - 1].statusCode === "201") {
							var manufacturingUserAddSuccessMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
								"manufacturingUserAddSuccessMsg", [
									addedUserName
								]);
							sap.m.MessageToast.show(manufacturingUserAddSuccessMsg);
							this.AddBusinessPartnerDialog.close();
						}
					} else {
						var responseBody = successResponse.__batchResponses[0].response.body;
						var responseJSON = JSON.parse(responseBody);
						var ErrorMSG = "";
						if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/004" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/005" ||
							responseJSON.error.code === "MPE_USER_GROUP_MSGS/006") {
							sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddBusinessPartnerDialog", "MfgBusinessPartner")).setValueState(
								sap.ui.core.ValueState.Error);
						} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/007" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/008") {
							sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddBusinessPartnerDialog", "WorkCenter")).setValueState(
								sap.ui.core.ValueState.Error);
						} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/018" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/019") {
							sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddBusinessPartnerDialog", "Plant")).setValueState(
								sap.ui.core.ValueState.Error);

						} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/025") {
							sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddBusinessPartnerDialog", "WorkCenter")).setValueState(
								sap.ui.core.ValueState.Error);
							sap.ui.getCore().byId(sap.ui.core.Fragment.createId("AddBusinessPartnerDialog", "Plant")).setValueState(
								sap.ui.core.ValueState.Error);

						} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/027") {

							this.getOwnerComponent().getModel().resetChanges();
							this.AddBusinessPartnerDialog.close();

						}
						ErrorMSG = responseJSON.error.message.value;
						sap.m.MessageToast.show(ErrorMSG);
					}
					var oId = this.createId("listReport");
					this.getView().byId(oId).rebindTable();
				}, this),

				error: $.proxy(function (errorResponse) {
					this.getOwnerComponent().getModel().resetChanges();
					this.AddBusinessPartnerDialog.close();
				}, this)
			});
		}
		sap.ui.getCore().getMessageManager().removeAllMessages();
	},

	onCreateBPClosePress: function (oEvent)

	{
		this.getOwnerComponent().getModel().resetChanges();
		sap.ui.getCore().getMessageManager().removeAllMessages();
		this.AddBusinessPartnerDialog.close();
	},

	onClickUserEditButton: function (oEvent) {

		var oApi = this.extensionAPI;
		if (oApi.getSelectedContexts().length > 0) {
			if (!this.EditBusinessPartnerDialog) {
				this.EditBusinessPartnerDialog = sap.ui.xmlfragment("EditBusinessPartnerDialog",
					"i2d.mpe.mfguser.manages1.ext.fragment.EditBusinessPartner", this);
				this.EditBusinessPartnerDialog.setModel(this.getOwnerComponent().getModel("i18n"), "i18n");
				this.getView().addDependent(this.EditBusinessPartnerDialog);
			}
			var path = oApi.getSelectedContexts();
			var sPath = path[0].sPath;
			this.EditBusinessPartnerDialog.bindElement(sPath);
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "WorkCenter")).setValueState(
				sap.ui.core.ValueState.None);
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "Plant")).setValueState(
				sap.ui.core.ValueState.None);
			this.EditBusinessPartnerDialog.open();
		}

	},

	onEditBPOKPress: function (oEvent) {
		var sPath = this.EditBusinessPartnerDialog.getBindingContext().getPath();
		var workCenter = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "WorkCenter")).getValue();
		var plant = sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "Plant")).getValue();
		var editedUser = this.getOwnerComponent().getModel().getProperty(sPath).BusinessPartnerName;
		if (workCenter.length > 8) {
			var ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("workCenterTooLong");
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "WorkCenter")).setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageToast.show(ErrorMSG);
			this.EditBusinessPartnerDialog.setBusy(false);
		} else if (plant.length > 4) {
			ErrorMSG = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("plantTooLong");
			sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "Plant")).setValueState(sap.ui.core.ValueState.Error);
			sap.m.MessageToast.show(ErrorMSG);
			this.EditBusinessPartnerDialog.setBusy(false);
		} else {
			if (this.getOwnerComponent().getModel().hasPendingChanges()) {
				this.getOwnerComponent().getModel().submitChanges({

					success: jQuery.proxy(function (data) {

						this.EditBusinessPartnerDialog.setBusy(false);
						var response = data.__batchResponses[data.__batchResponses.length - 1];
						var responseKeys = Object.keys(response);
						var check = false;
						for (var i in responseKeys) {
							if (responseKeys[i] === "__changeResponses") {
								check = true;
							}
						}

						if (check) {
							if (response.__changeResponses[response.__changeResponses.length - 1].statusCode === "204") {
								var userEditSuccessMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
									"userEditSuccessMsg", [
										editedUser
									]);
								sap.m.MessageToast.show(userEditSuccessMsg);
								this.EditBusinessPartnerDialog.close();
							}
						} else {

							var responseBody = data.__batchResponses[0].response.body;
							var responseJSON = JSON.parse(responseBody);
							var ErrorMSG = "";

							if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/007" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/008" ||
								responseJSON.error.code === "MPE_USER_GROUP_MSGS/033") {
								sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "WorkCenter")).setValueState(
									sap.ui.core.ValueState.Error);
							} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/018" || responseJSON.error.code === "MPE_USER_GROUP_MSGS/019") {
								sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "Plant")).setValueState(
									sap.ui.core.ValueState.Error);
							} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/025") {
								sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "WorkCenter")).setValueState(
									sap.ui.core.ValueState.Error);
								sap.ui.getCore().byId(sap.ui.core.Fragment.createId("EditBusinessPartnerDialog", "Plant")).setValueState(
									sap.ui.core.ValueState.Error);
							} else if (responseJSON.error.code === "MPE_USER_GROUP_MSGS/027") {
								this.getOwnerComponent().getModel().resetChanges();
								this.EditBusinessPartnerDialog.close();

							}
							ErrorMSG = responseJSON.error.message.value;
							sap.m.MessageToast.show(ErrorMSG);
						}
						this.getOwnerComponent().getModel().refresh(true);
					}, this),

					error: jQuery.proxy(function (activationResponse) {
						var networkErrorMsg = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(
							"networkErrorMsg");
						sap.m.MessageToast.show(networkErrorMsg);
						this.getOwnerComponent().getModel().refresh(true);
						this.EditBusinessPartnerDialog.close();
					}, this)

				});
			} else

			{
				this.EditBusinessPartnerDialog.close();

			}
		}
		sap.ui.getCore().getMessageManager().removeAllMessages();
	},

	onEditBPClosePress: function (oEvent)

	{
		this.getOwnerComponent().getModel().resetChanges();
		sap.ui.getCore().getMessageManager().removeAllMessages();
		this.EditBusinessPartnerDialog.close();
	}

});